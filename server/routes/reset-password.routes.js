import express from "express";

import {
  sendPasswordResetLink,
  verifyPasswordResetLink,
  resetPassword,
} from "../controllers/password-reset.controller.js";

const router = express.Router();

router.route("/").post(sendPasswordResetLink);
router.route("/:id/:token").get(verifyPasswordResetLink);
router.route("/:id/:token").post(resetPassword);

export default router;
