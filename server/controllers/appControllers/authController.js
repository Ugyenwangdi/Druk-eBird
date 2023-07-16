import User from "../../mongodb/models/user.js";
import jwt from "jsonwebtoken";
import AppError from "../../utils/appUtils/appError.js";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const signup = async (req, res, next) => {
  try {
    const userCredentials = res.locals.nameAndEmail;
    var name = userCredentials[0];
    var email = userCredentials[1];

    const { dob, country, profession, password, passwordConfirm } = req.body;

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "user already exist" });

    const newUser = await User.create({
      name,
      email,
      dob,
      country,
      profession,
      password,
      passwordConfirm,
    });
    createSendToken(newUser, 201, res);

    res.status(201).json({ status: "success" });
  } catch (err) {
    res.status(401).json({
      message: Object.values(err.errors).map((val) => val.message)[0],
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //1) check if email and password exist
    if (!email || !password) {
      //return next(new AppError('Please provide an email and password!', 400))
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    //2) Check if user exists && password is correct

    const user = await User.findOne({ email }).select("+password");

    //const correct = await user.correctPassword(password, user.password)

    if (!user || !(await user.correctPassword(password, user.password))) {
      //return next(new AppError('Incorrect email or password', 401))
      return res.status(401).json({ message: "Incorrect email or password" });
    }
    //3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError(
          "you are not logged in! Please login in to get access.",
          401
        )
      );
    }
    // 2) Verification token
    // const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 3) Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new AppError("The user belonging to this token no longer exist", 401)
      );
    }
    // Grant access to protected route
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      //return next(new AppError('Your current password is wrong',401))
      return res
        .status(401)
        .json({ message: "Your current password is wrong" });
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { signup, login, protect, updatePassword };
