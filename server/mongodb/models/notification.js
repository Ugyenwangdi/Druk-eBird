import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Message field is required"],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, collection: "adminnotifications" }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
