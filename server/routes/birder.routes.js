import express from "express";
import {
  getBirdersCount,
  getAllBirders,
  getTopBirders,
  getBirderByID,
  deleteBirder,
} from "../controllers/birder.controller.js";

const router = express.Router();

router.route("/birders-count").get(getBirdersCount);
router.route("/birders").get(getAllBirders);

router.route("/birders/top").get(getTopBirders);
router.route("/birders/:id").get(getBirderByID);
router.route("/birders/:id").delete(authMiddleware, deleteBirder);


export default router;
