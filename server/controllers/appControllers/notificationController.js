import notifications from "../../mongodb/models/NotificationModel.js";
import jwt from "jsonwebtoken";

const createNotification = async (req, res) => {
  try {
    const notification = await notifications.create(req.body);
    res.json({ data: notification, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const userNotification = await notifications.find({
      userId: req.params.userId,
    });
    res.json({ data: userNotification, status: "success" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification1 = await notifications.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        notification1,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

export { createNotification, getNotification, deleteNotification };
