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

const BirdsSchema = new mongoose.Schema(
  {
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
    // userId: {
    //   type: String,
    //   required: [true, "userId"],
    // },
    StartbirdingData: [detailSchema],
  },
  { _id: true, timestamps: true }
);

const ChecklistTest = mongoose.model("ChecklistTest", BirdsSchema);
export default ChecklistTest;

//

// import mongoose from "mongoose";
// import moment from "moment";

// const currentLocation = new mongoose.Schema({
//   latitude: {
//     type: Number,
//     required: [true, "latitude"],
//     default: 0,
//   },
//   longitude: {
//     type: Number,
//     required: [true, "longitude"],
//     default: 0,
//   },
// });

// const EndpointLocation = new mongoose.Schema({
//   dzongkhag: {
//     type: String,
//     default: "null",
//   },
//   gewog: {
//     type: String,
//     default: "null",
//   },
//   village: {
//     type: String,
//     default: "null",
//   },
// });

// const detailSchema = new mongoose.Schema({
//   selectedDate: {
//     type: String,
//     required: [true, "Date"],
//     default: moment().format("YYYY-MM-DD"),
//   },
//   selectedTime: {
//     type: String,
//     required: [true, "Time"],
//     default: moment().format("HH:mm:ss"),
//   },
//   observer: {
//     type: String,
//     required: [true, "observer"],
//     default: "null",
//   },
//   currentLocation: currentLocation,
//   count: {
//     adult: { type: Number },
//     juvenile: { type: Number },
//     total: { type: Number },
//   },
//   photo: {
//     type: String,
//     default: "null",
//   },
//   EndpointLocation: [EndpointLocation],
//   approvalStatus: {
//     type: String,
//     default: "none",
//   },
// });

// const BirdsSchema = new mongoose.Schema(
//   {
//     CheckListName: {
//       type: String,
//       required: [true, "CheckListName"],
//       default: "null",
//     },
//     BirdName: {
//       type: String,
//       required: [true, "BirdName"],
//       default: "null",
//     },
//     StartbirdingData: [detailSchema],
//   },
//   { _id: true, timestamps: true }
// );

// const ChecklistTest = mongoose.model("ChecklistTest", BirdsSchema);

// export default ChecklistTest;

// import mongoose from "mongoose";

// const checklistTestSchema = new mongoose.Schema(
//   {
//     checklistName: { type: String, required: true },
//     birdName: { type: String, required: false },
//     count: {
//       adult: { type: Number },
//       juvenile: { type: Number },
//       total: { type: Number },
//     },
//     selectedDate: { type: Date, required: false },
//     selectedTime: { type: String, required: false },
//     currentLocation: {
//       latitude: { type: String, required: false },
//       longitude: { type: String, required: false },
//     },
//     birder: { type: String, required: false },
//     endpointLocation: { type: String, required: false },
//     photos: [{ url: { type: String } }],
//   },
//   { _id: true, timestamps: true }
// );

// const ChecklistTest = mongoose.model("ChecklistTest", checklistTestSchema);

// export default ChecklistTest;
