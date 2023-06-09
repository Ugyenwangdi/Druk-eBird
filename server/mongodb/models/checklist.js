import mongoose from "mongoose";
import moment from "moment";

const currentLocation = new mongoose.Schema({
  latitude: {
    type: Number,
    required: [true, "latitude"],
    default: 0,
  },
  longitude: {
    type: Number,
    required: [true, "longitude"],
    default: 0,
  },
});

const EndpointLocation = new mongoose.Schema({
  dzongkhag: {
    type: String,
    default: "null",
  },
  gewog: {
    type: String,
    default: "null",
  },
  village: {
    type: String,
    default: "null",
  },
});

const detailSchema = new mongoose.Schema({
  selectedDate: {
    type: String,
    required: [true, "Date"],
    default: moment().format("YYYY-MM-DD"),
  },
  selectedTime: {
    type: String,
    required: [true, "Time"],
    default: moment().format("HH:mm:ss"),
  },
  observer: {
    type: String,
    required: [true, "observer"],
    default: "null",
  },
  currentLocation: currentLocation,
  Totalcount: {
    type: Number,
    required: [true, "Count"],
    default: 0,
  },
  JAcount: {
    Adult: {
      type: Number,
      required: [true, "Adult"],
      default: 0,
    },
    Juvenile: {
      type: Number,
      required: [true, "Juvenile"],
      default: 0,
    },
  },
  Remarks: {
    type: String,
    required: [true, "Remarks"],
    default: "null",
  },
  photo: {
    type: String,
    default: "null",
  },
  EndpointLocation: [EndpointLocation],
  status: {
    type: String,
    default: "draftchecklist",
  },
  Approvedstatus: {
    type: String,
    default: "pending",
  },
});

const BirdsSchema = new mongoose.Schema({
  CheckListName: {
    type: String,
    required: [true, "CheckListName"],
    default: "null",
  },
  BirdName: {
    type: String,
    required: [true, "BirdName"],
    default: "null",
  },
  userId: {
    type: String,
    required: [true, "userId"],
  },
  StartbirdingData: [detailSchema],
});

const checkList = mongoose.model("checkList", BirdsSchema);
export default checkList;
