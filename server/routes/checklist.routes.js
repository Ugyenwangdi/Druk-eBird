import express from "express";

import upload from "../utils/multer.js";

import {
  getChecklistCount,
  createChecklist,
  getAllEntries,
  getChecklistDetail,
  updateChecklist,
  uploadExcelFile,
  deleteChecklist,
  getChecklists,
  getNewSpecies,
  analyzeChecklists,
  analyzeDistrictSpecies,
  analyzeDistrictChecklists,
  analyzeDistrictEntries,
  getTotalBirdingSites,
  analyzeTopBirders,
} from "../controllers/checklist.controller.js";

const router = express.Router();

router.route("/checklists/get-count").get(getChecklistCount);
router.route("/entries").get(getAllEntries);
router.route("/checklists").get(getChecklists);
router.route("/newspecies").get(getNewSpecies);

router.route("/checklists/:id").get(getChecklistDetail);
router.route("/checklists/:id").patch(updateChecklist);
router.route("/checklists").post(createChecklist);
router.route("/checklists/:id").delete(deleteChecklist);

router.post("/checklists/fileupload", upload.single("file"), uploadExcelFile);
router.post("/checklists/analyze", upload.single("file"), analyzeChecklists);
router
  .route("/checklists/analyze/district-species")
  .get(analyzeDistrictSpecies);
router
  .route("/checklists/analyze/district-checklists")
  .get(analyzeDistrictChecklists);
router
  .route("/checklists/analyze/district-entries")
  .get(analyzeDistrictEntries);
router
  .route("/checklists/analyze/birdingsites-count")
  .get(getTotalBirdingSites);
router.route("/checklists/analyze/top-birders").get(analyzeTopBirders);

export default router;
