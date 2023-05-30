import express from "express";

import upload from "../utils/multer.js";

import {
  getCount,
  createChecklist,
  getAllChecklist,
  getChecklistDetail,
  updateChecklist,
  uploadExcelFile,
  deleteChecklist,
  analyzeChecklists,
  analyzeDistrictSpecies,
  analyzeDistrictChecklists,
  analyzeDistrictEntries,
  analyzeTopBirders,
} from "../controllers/checklist.controller.js";

const router = express.Router();

router.route("/get-count").get(getCount);
router.route("/").get(getAllChecklist);
router.route("/:id").get(getChecklistDetail);
router.route("/:id").patch(updateChecklist);
router.route("/").post(createChecklist);
router.route("/:id").delete(deleteChecklist);

router.post("/fileupload", upload.single("file"), uploadExcelFile);
router.post("/analyze", upload.single("file"), analyzeChecklists);
router.route("/analyze/district-species").get(analyzeDistrictSpecies);
router.route("/analyze/district-checklists").get(analyzeDistrictChecklists);
router.route("/analyze/district-entries").get(analyzeDistrictEntries);
router.route("/analyze/top-birders").get(analyzeTopBirders);

export default router;
