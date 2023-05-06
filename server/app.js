import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import connectDB from "./mongodb/connect.js";
import { Admin } from "./mongodb/models/adminSchema.js";
import authRoute from "./routes/auth.routes.js";
import speciesRouter from "./routes/species.routes.js";

const app = express();
app.setMaxListeners(15);
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// app.use(
//   session({
//     secret: process.env.PASSPORT_LONG_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
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
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

app.get("/", (req, res) => {
  console.log("user: ", req.user);

  res.send({ message: "Hello World!" });
});

app.use("", authRoute);
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
