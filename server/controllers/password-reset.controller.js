import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import crypto from "crypto";

import AdminToken from "../mongodb/models/token.js";
import { Admin } from "../mongodb/models/adminSchema.js";
import sendEmail from "../utils/sendEmail.js";

function isValidEmail(email) {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,26}$/;
  return regex.test(password);
}

// send password link
const sendPasswordResetLink = async (req, res) => {
  try {
    if (!req.body.email) {
      return res
        .status(400)
        .send({ message: "Please enter an email address!" });
    }

    if (!isValidEmail(req.body.email)) {
      return res
        .status(400)
        .send({ message: "Please enter a valid email address!" });
    }

    let user = await Admin.findOne({ email: req.body.email });
    // console.log(user);

    if (!user)
      return res
        .status(400)
        .send({ message: "User with given email does not exist!" });

    let token = await AdminToken.findOne({ userId: user._id });
    if (!token) {
      token = await new AdminToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `${process.env.CLIENT_URL}/password-reset/${user._id}/${token.token}`;
    await sendEmail(user.email, "Password Reset", url);

    res
      .status(200)
      .send({ message: "Password reset link sent to your email!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// verify password reset link
const verifyPasswordResetLink = async (req, res) => {
  try {
    const user = await Admin.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ message: "Invalid link: User not found!" });

    const token = await AdminToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res
        .status(400)
        .send({ message: "Invalid link: Token not valid!" });

    res.status(200).send("Valid Url");
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

//  set new password
const setNewPassword = async (req, res) => {
  try {
    if (!req.body.oldPassword || !req.body.newPassword) {
      return res
        .status(400)
        .json({ message: "Old Password and New Password are required" });
    }

    if (!isValidPassword(req.body.newPassword)) {
      return res.status(400).send({
        message:
          "Password must be between 8 and 26 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
      });
    }

    const user = await Admin.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ message: "Invalid link: User not found!" });

    const token = await AdminToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Token invalid!" });

    // Change the password
    await user.changePassword(req.body.oldPassword, req.body.newPassword);

    await AdminToken.deleteOne({ _id: token._id }); // remove the token from the database

    res.status(200).send({ message: "Password reset successful!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { sendPasswordResetLink, verifyPasswordResetLink, setNewPassword };
