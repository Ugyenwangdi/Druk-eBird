import express from "express";
import { Admin } from "../mongodb/models/admin.js";
import AdminToken from "../mongodb/models/token.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import bcrypt from "bcrypt";
import validator from "validator";

const router = express.Router();

// send password link
router.post("/", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);

    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await Admin.findOne({ email: req.body.email });
    // console.log(user);

    if (!user)
      return res
        .status(409)
        .send({ message: "User with given email does not exist!" });

    let token = await AdminToken.findOne({ userId: user._id });
    if (!token) {
      token = await new AdminToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.CLIENT_URL}password-reset/${user._id}/${token.token}/`;
    await sendEmail(user.email, "Password Reset", url);

    res
      .status(200)
      .send({ message: "Password reset link sent to your email!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// verify password reset link
router.get("/:id/:token", async (req, res) => {
  try {
    const user = await Admin.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await AdminToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    res.status(200).send("Valid Url");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

//  set new password
router.post("/:id/:token", async (req, res) => {
  try {
    const passwordSchema = Joi.object({
      password: passwordComplexity().required().label("Password"),
    });
    const { error } = passwordSchema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await Admin.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await AdminToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user.password = hashPassword;
    await user.save();

    await AdminToken.deleteOne({ _id: token._id }); // remove the token from the database

    res.status(200).send({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
