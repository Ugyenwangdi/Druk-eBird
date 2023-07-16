import express from "express";
import {
  createNotification,
  deleteNotification,
  getNotification,
} from "../../controllers/appControllers/notificationController.js";

const router = express.Router();

router.route("/sendNotification").post(createNotification);

router
  .route("/:id")
  //   .get(notificationController.getNotification)
  .delete(deleteNotification);

router.get("/:userId", getNotification);

export default router;
