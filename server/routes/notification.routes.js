import express from "express";
import {
  createNotification,
  getAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Create a new notification
router.route("/").post(createNotification);

// Get all notifications for the logged-in admin
router.route("/").get(getAllNotifications);

export default router;
