import express from "express";

import upload from "../utils/multer.js";

import {
  getCount,
  createSpecies,
  getSpecies,
  getAllSpecies,
  getSpeciesDetail,
  updateSpecies,
  deleteSpecies,
  deleteSpeciesPhoto,
  uploadExcelFile,
} from "../controllers/species.controller.js";
import {
  checkAuthStatus,
  authMiddleware,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/get-count").get(getCount);
router.route("/").get(getAllSpecies);
router.route("/get").get(getSpecies);
router.route("/:id").get(getSpeciesDetail);
router.route("/").post(authMiddleware, createSpecies);
router.route("/:id").patch(authMiddleware, updateSpecies);
router.route("/:id").delete(authMiddleware, deleteSpecies);
router.route("/:id/photos/:photoId").delete(authMiddleware, deleteSpeciesPhoto);

router.post(
  "/fileupload",
  authMiddleware,
  upload.single("file"),
  uploadExcelFile
);

export default router;
