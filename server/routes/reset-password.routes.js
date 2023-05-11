import express from "express";

import {
  sendPasswordResetLink,
  verifyPasswordResetLink,
  setNewPassword,
} from "../controllers/password-reset.controller.js";

const router = express.Router();

router.route("/").post(sendPasswordResetLink);
router.route("/:id/:token").get(verifyPasswordResetLink);
router.route("/:id/:token").post(setNewPassword);

export default router;
