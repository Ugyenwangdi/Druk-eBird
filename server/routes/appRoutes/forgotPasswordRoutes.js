import express from "express";
import {
  forgotPassword,
  setPassword,
} from "../../controllers/appControllers/forgotPasswordControllers.js";

const router = express.Router();

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:id", setPassword);

export default router;
