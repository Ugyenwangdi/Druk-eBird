import express from "express";
import passport from "passport";
import {
  baseRoute,
  // validateSession,
  checkAuthStatus,
  authMiddleware,
  registerUser,
  loginUser,
  getUserByID,
  logoutUser,
  getAllUsers,
  deleteUser,
  secretPage,
  googleAuth,
  successGoogleLogin,
  failedGoogleLogin,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

// const ensureAuthenticated = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   } else {
//     return res.status(401).json({ error: "User not logged in!" });
//   }
// };

// // route to check if user is logged in
// router.get("/auth/checkLoggedIn", authMiddleware, (req, res) => {
//   res.json({ message: "User is logged in" });
// });

router.route("").get(authMiddleware, baseRoute);
router.route("/auth/checkLoggedIn").get(authMiddleware, checkAuthStatus);

// Google Authentication routes
router.route("/auth/google").get(googleAuth);
router.route("/auth/login/success").get(successGoogleLogin);
router.route("/auth/login/failed").get(failedGoogleLogin);
router.route("/auth/google/callback").get(googleAuthCallback);

// Register and Login POST routes
router.route("/auth/register").post(authMiddleware, registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").post(logoutUser);

// User GET routes
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserByID);
router.route("/users/:id").delete(authMiddleware, deleteUser);

// Secret route
router.route("/secrets").get(authMiddleware, secretPage);

export default router;
