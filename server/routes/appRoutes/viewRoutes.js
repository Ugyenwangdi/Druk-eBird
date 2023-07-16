import express from "express";
const router = express.Router();
import { getResetPassword } from "../../controllers/appControllers/viewControllers.js";

router.get("/resetPassword/:id", getResetPassword);

export default router;
