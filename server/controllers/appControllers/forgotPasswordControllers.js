import User from "../../mongodb/models/user.js";
import AppError from "../../utils/appUtils/appError.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import validator from "validator";

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.status(400).json({ message: "User Not Exists!!" });
    }

    const link = `https://druk-ebird-backend.onrender.com/app/api/v1/resetPassword/${oldUser._id}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "drukebird@gmail.com",
        pass: "vtzyoayzektgoyia",
      },
    });

    var mailOptions = {
      from: "drukebird@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Hi \n please click on the link below to reset your password: \n ${link}`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(201).json({ message: "You should receive an email" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const setPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const oldUser = await User.findOne({ _id: id });

    if (!oldUser) {
      return res.status(400).json({ message: "User Not Exists" });
    }

    if (password.length < 8) {
      return res
        .status(500)
        .json({ message: "Enter a password with more than 8 characters." });
    } else if (!/[a-z]/.test(password)) {
      return res
        .status(500)
        .json({ message: "Enter at least one lowercase letter." });
    } else if (!/[A-Z]/.test(password)) {
      return res
        .status(500)
        .json({ message: "Enter at least one uppercase letter." });
    } else if (!/\d/.test(password)) {
      return res.status(500).json({ message: "Enter at least one digit." });
    }

    const newPassword = await bcrypt.hash(password, 12);

    await User.findByIdAndUpdate(
      id,
      {
        password: newPassword,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    return res.json({ message: err });
  }
};

export { forgotPassword, setPassword };
