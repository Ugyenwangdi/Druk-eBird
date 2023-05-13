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
  editAdminUser,
  updateProfile,
  updatePassword,
  deactivateAccount,
  deleteUser,
  secretPage,
  googleAuth,
  successGoogleLogin,
  failedGoogleLogin,
  googleAuthCallback,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("").get(authMiddleware, baseRoute);
router.route("/auth/checkLoggedIn").get(authMiddleware, checkAuthStatus);

// Google Authentication routes
router.route("/auth/google").get(googleAuth);
router.route("/auth/login/success").get(successGoogleLogin);
router.route("/auth/login/failed").get(failedGoogleLogin);
router.route("/auth/google/callback").get(googleAuthCallback);

// User Auth routes
router.route("/auth/register-admin").post(authMiddleware, registerUser);
router.route("/auth/login").post(loginUser);
router.route("/auth/logout").post(logoutUser);

// User routes
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserByID);
router.route("/users/:id").patch(authMiddleware, editAdminUser);
router.route("/users/:id").delete(authMiddleware, deleteUser);
router.route("/users/:id/update-profile").patch(authMiddleware, updateProfile);
router.route("/users/:id/deactivate").patch(authMiddleware, deactivateAccount);
router.route("/users/:id/update-password").post(authMiddleware, updatePassword);

// Secret route
router.route("/secrets").get(authMiddleware, secretPage);

export default router;
