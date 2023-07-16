import User from "../../mongodb/models/user.js";
import nodemailer from "nodemailer";
import randomstring from "randomstring";

var OTP = "123456";
var Name = "Tshering";
var Email = "humblewangs777@gmail.com";

const getNameAndEmail = (req, res, next) => {
  res.locals.nameAndEmail = [Name, Email];
  next();
};

const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "drukebird@gmail.com",
        pass: "vtzyoayzektgoyia",
      },
    });

    const mailOptions = {
      from: "drukebird@gmail.com",
      to: email,
      subject: "Verifying User",
      html:
        `<p> Hi ` +
        name +
        `, register with DrukeBird using the token below: </p><br>
          <h1>` +
        token +
        `</h1><br> 
          <p>enter OTP to reset your password</p>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent:- ", info.response);
      }
    });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};
const signupVerification = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    Name = name;
    Email = email;

    const randomString = randomstring.generate(6);
    OTP = randomString;
    sendResetPasswordMail(name, email, randomString);

    res.name = name;
    res.email = email;
    res.status(200).json({
      status: "success",
      msg: "please check your mail.",
    });
  } catch (error) {
    res.status(400).json({
      error: err.message,
    });
  }
};

const enter_OTP = async (req, res) => {
  try {
    const OTP_recieved = req.body.otp;
    if (OTP_recieved === OTP) {
      res.status(200).json({ status: "success", msg: "Correct OTP" });
    } else {
      res.status(200).json({ error: "error", msg: "OPT invalid" });
    }
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    console.log("users ", users);
    res.status(200).json({ data: users, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, req.body);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json({ data: user, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const updateMe = async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("Not for password updates", 400));
    }
    console.log(req.body);
    const filterBody = filterObj(
      req.body,
      "name",
      "dob",
      "profession",
      "photo"
    );
    const updateUser = await User.findByIdAndUpdate(
      req.user.id,
      filterBody,
      {
        new: true,
        runValidators: true,
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      data: { user: updateUser },
    });
  } catch (err) {
    console.log("Here");
    res.status(500).json({ error: err.message });
  }
};

export {
  getNameAndEmail,
  signupVerification,
  enter_OTP,
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  filterObj,
  updateMe,
};
