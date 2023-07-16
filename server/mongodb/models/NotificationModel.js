import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    BirdName: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: true,
    },
    // timestamp: {
    //   type: Date,
    //   required: true,
    // },
  },
  {
    collection: "notifications",
  }
);
const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema
);

export default NotificationModel;
