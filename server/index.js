import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import path from "path";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./mongodb/connect.js";
import { Admin } from "./mongodb/models/admin.js";
import authRoute from "./routes/auth.routes.js";
import passwordResetRoutes from "./routes/reset-password.routes.js";
import speciesRoutes from "./routes/species.routes.js";
import checklistRoutes from "./routes/checklist.routes.js";
import birderRoutes from "./routes/birder.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

// App
import appChecklistRoutes from "./routes/appRoutes/CheckListRoutes.js";
import appNotificationRoutes from "./routes/appRoutes/NotificationRoutes.js";
import appUserRoutes from "./routes/appRoutes/userRoutes.js";
import appForgotPasswordRoutes from "./routes/appRoutes/forgotPasswordRoutes.js";
import appViewRoutes from "./routes/appRoutes/viewRoutes.js";

const app = express();
app.setMaxListeners(15);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.PASSPORT_LONG_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("", authRoute);
app.use("/api/v1/password-reset", passwordResetRoutes);
app.use("/api/v1/species", speciesRoutes);
app.use("/api/v1", birderRoutes);
app.use("/api/v1", checklistRoutes);
app.use("/notifications", notificationRoutes);

// App
app.use("/app/api/v1/checkList", appChecklistRoutes);
app.use("/app/api/v1/notifications", appNotificationRoutes);
app.use("/app/api/v1/users", appUserRoutes);
app.use("/app/api/v1", appForgotPasswordRoutes);
app.use("/app/api/v1", appViewRoutes);

// app.use(express.static(path.join(__dirname, "views")));
app.use("/static", express.static("views"));

const server = http.createServer(app);
const io = new Server(server);

// Set up change stream

import CheckListModel from "./mongodb/models/checklist.js";
import NotificationModel from "./mongodb/models/NotificationModel.js";

const changeStream = CheckListModel.watch({
  $match: { "updateDescription.updatedFields.BirdName": { $exists: true } },
});
// Listen for change events
changeStream.on("change", async (change) => {
  try {
    const updatedField = change.updateDescription.updatedFields.BirdName;
    console.log(`Field 'BirdName' updated:`, updatedField);

    // Retrieve the updated checklist document from CheckListModel
    const checklist = await CheckListModel.findById(change.documentKey._id);
    console.log(checklist.userId);

    if (!checklist) {
      return;
    }

    // Update the checklist data in CheckListModel
    await CheckListModel.updateOne(
      { _id: change.documentKey._id },
      { $set: { BirdName: updatedField } }
    );

    const photo = checklist.StartbirdingData[0].photo;
    const userId = checklist.userId;
    // Create a new notification document using the retrieved fields
    const newNotification = new NotificationModel({
      userId: userId,
      BirdName: updatedField,
      photoUrl: photo, // Assuming the updatedField holds the photo URL
    });

    // Save the new notification to the database
    await newNotification.save();
  } catch (error) {
    console.error(error);
  }
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);

    app.listen(8080, () =>
      console.log("Server started on port http://localhost:8080")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
