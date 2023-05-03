import * as dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { User } from "../mongodb/models/userSchema.js";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "320489601196-n64kjtci86p19g9okhpkf45jmsontqag.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile.emails[0].value);
      User.findOrCreate(
        {
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

const googleAuth = passport.authenticate("google", { scope: ["profile"] });

const successGoogleLogin = async (req, res) => {
  if (req.user) {
    req.session.user = req.user;
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
};

const failedGoogleLogin = async (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
};

const googleAuthCallback = passport.authenticate("google", {
  successRedirect: "http://localhost:3000/",
  failureRedirect: "/auth/login/failed",
});

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // check password validation
  if (
    !req.body.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,26}$/
    )
  ) {
    return res.status(400).json({
      message:
        "Password must be between 8 and 26 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
    });
  }

  User.register(
    {
      email: req.body.email, // explicitly set the username field
      name: req.body.name,
      country: req.body.country,
    },
    req.body.password,
    (err, user) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      passport.authenticate("local")(req, res, () => {
        return res
          .status(200)
          .json({ message: "User registered successfully!" });
      });
    }
  );
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password!" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = user;
      return res
        .status(200)
        .json({ user: req.user, message: "Login successful!" });
    });
  })(req, res, next);
};

const getUserByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const secretPage = async (req, res) => {
  return res.status(200).json({ message: "Congrats!" });
};

const logoutUser = async (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
};

export {
  // passport local controllers
  getAllUsers,
  logoutUser,
  registerUser,
  loginUser,
  getUserByID,
  secretPage,

  // google auth controllers
  googleAuth,
  successGoogleLogin,
  failedGoogleLogin,
  googleAuthCallback,
};
