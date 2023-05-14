import express from "express";

import upload from "../utils/multer.js";

import {
  createSpecies,
  getAllSpecies,
  searchSpecies,
  getSpeciesDetail,
  updateSpecies,
  deleteSpecies,
  deleteSpeciesPhoto,
  uploadExcelFile,
} from "../controllers/species.controller.js";

const router = express.Router();

router.route("/").get(getAllSpecies);
router.route("/birds").get(searchSpecies);
router.route("/:id").get(getSpeciesDetail);
router.route("/").post(createSpecies);
router.route("/:id").patch(updateSpecies);
router.route("/:id").delete(deleteSpecies);
router.route("/:id/photos/:photoId").delete(deleteSpeciesPhoto);

router.post("/fileupload", upload.single("file"), uploadExcelFile);

export default router;
