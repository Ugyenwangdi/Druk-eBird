import express from "express";

import upload from "../utils/multer.js";

import {
  createChecklist,
  getAllChecklist,
  getChecklistDetail,
  uploadExcelFile,
  deleteChecklist,
  analyzeChecklists,
  analyzeDistrictChecklists,
} from "../controllers/checklist.controller.js";

const router = express.Router();

router.route("/").get(getAllChecklist);
router.route("/:id").get(getChecklistDetail);
router.route("/").post(createChecklist);
router.route("/:id").delete(deleteChecklist);

router.post("/fileupload", upload.single("file"), uploadExcelFile);
router.post("/analyze", upload.single("file"), analyzeChecklists);
router.route("/analyze/district-checklists").get(analyzeDistrictChecklists);

export default router;
