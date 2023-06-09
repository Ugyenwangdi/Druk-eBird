import express from "express";
import {
  getBirdersCount,
  getAllBirders,
  getBirderByID,
  deleteBirder,
} from "../controllers/birder.controller.js";
import { authMiddleware } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/birders-count").get(getBirdersCount);

router.route("/birders").get(getAllBirders);
router.route("/birders/:id").get(getBirderByID);
router.route("/birders/:id").delete(authMiddleware, deleteBirder);

export default router;
