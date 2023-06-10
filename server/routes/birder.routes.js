import express from "express";
import {
  getBirdersCount,
  getAllBirders,
} from "../controllers/birder.controller.js";

const router = express.Router();

router.route("/birders-count").get(getBirdersCount);

router.route("/birders").get(getAllBirders);

export default router;
