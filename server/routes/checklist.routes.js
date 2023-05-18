import express from "express";

import upload from "../utils/multer.js";

import { analyzeChecklists } from "../controllers/checklist.controller.js";

import {
  checkAuthStatus,
  authMiddleware,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/analyze-checklists", upload.single("file"), analyzeChecklists);

export default router;
