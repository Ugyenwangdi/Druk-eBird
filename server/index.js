import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";

import connectDB from "./mongodb/connect.js";
import { Admin } from "./mongodb/models/admin.js";
import authRoute from "./routes/auth.routes.js";
import passwordResetRoutes from "./routes/reset-password.routes.js";
import speciesRoutes from "./routes/species.routes.js";
import checklistRoutes from "./routes/checklist.routes.js";
import birderRoutes from "./routes/birder.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();
app.setMaxListeners(15);
app.use(express.json({ limit: "50mb" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.PASSPORT_LONG_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  })
);

passport.use(Admin.createStrategy());

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      name: user.name,
      email: user.email, // what we want to retrieve when we call req.user
      googleId: user.googleId,
      userType: user.userType,
      isDeactivated: user.isDeactivated,
      profile: user.profile, //
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.use("", authRoute);
app.use("/api/v1/password-reset", passwordResetRoutes);
app.use("/api/v1/species", speciesRoutes);
app.use("/api/v1", birderRoutes);
app.use("/api/v1", checklistRoutes);
app.use("/notifications", notificationRoutes);

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
