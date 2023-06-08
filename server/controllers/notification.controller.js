import Notification from "../mongodb/models/notification.js";

// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { message } = req.body;

    // Create a new notification and associate it with all admins
    const notification = await Notification.create({
      message,
    });

    res.status(201).json({ notification });
  } catch (error) {
    res.status(500).json({ error: "Unable to create notification" });
  }
};

// Get all notifications for the logged-in admin
const getAllNotifications = async (req, res) => {
  try {
    // Find all notifications associated with the logged-in admin
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: "Unable to get notifications" });
  }
};

const getCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Failed to fetch species count:", error);
    res.status(500).json({ error: "Failed to fetch species count" });
  }
};

export { getAllNotifications, createNotification, getCount };
