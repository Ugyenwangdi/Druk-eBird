import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import passwordResetRoutes from "./routes/passwordReset.js";
import authRoute from "./routes/googleauth.js";
import speciesRouter from "./routes/species.routes.js";

import cookieSession from "cookie-session";
import passportStrategy from "./passport.js";

const app = express();
app.setMaxListeners(15);
app.use(express.json({ limit: "50mb" }));
app.use(cors());

app.use(
  cookieSession({
    name: "session",
    keys: ["drukebird"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send({ message: "Hello World!" });
});

// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/password-reset", passwordResetRoutes);
app.use("/auth", authRoute);
app.use("/api/v1/species", speciesRouter);

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
