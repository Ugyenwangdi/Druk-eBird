import express from "express";
import { getAllBirders } from "../controllers/birder.controller.js";

const router = express.Router();

router.route("/birders").get(getAllBirders);

export default router;
