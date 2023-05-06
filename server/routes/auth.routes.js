import express from "express";
import passport from "passport";
import {
  registerUser,
  loginUser,
  getUserByID,
  logoutUser,
  getAllUsers,
  secretPage,
  googleAuth,
  successGoogleLogin,
  failedGoogleLogin,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: "User not logged in!" });
  }

  // if (req.isAuthenticated()) {
  //   return next();
  // } else {
  //   return res.status(401).json({ error: "User not logged in!" });
  // }
};

// route to check if user is logged in
router.get("/auth/checkLoggedIn", ensureAuthenticated, (req, res) => {
  res.json({ message: "User is logged in" });
});

// Google Authentication routes
router.route("/auth/google").get(googleAuth);
router.route("/auth/login/success").get(successGoogleLogin);
router.route("/auth/login/failed").get(failedGoogleLogin);
router
  .route("/auth/google/callback")
  .get(googleAuthCallback, successGoogleLogin);

// Register and Login POST routes
router.route("/auth/register").post(registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").get(logoutUser);

// User GET routes
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserByID);

// Secret route
router.route("/secrets").get(ensureAuthenticated, secretPage);

export default router;
