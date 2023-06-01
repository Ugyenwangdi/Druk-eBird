import mongoose from "mongoose";

const checklistTestSchema = new mongoose.Schema(
  {
    checklistName: { type: String, required: true },
    birdName: { type: String, required: false },
    count: {
      adult: { type: Number },
      juvenile: { type: Number },
      total: { type: Number },
    },
    selectedDate: { type: Date, required: false },
    selectedTime: { type: String, required: false },
    currentLocation: {
      latitude: { type: String, required: false },
      longitude: { type: String, required: false },
    },
    birder: { type: String, required: false },
    endpointLocation: { type: String, required: false },
    photos: [{ url: { type: String } }],
  },
  { _id: true, timestamps: true }
);

const ChecklistTest = mongoose.model("ChecklistTest", checklistTestSchema);

export default ChecklistTest;
