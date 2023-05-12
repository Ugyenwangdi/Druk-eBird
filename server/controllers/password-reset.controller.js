import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import passport from "passport";
import crypto from "crypto";

import AdminToken from "../mongodb/models/token.js";
import { Admin } from "../mongodb/models/admin.js";
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
    await sendEmail(
      user.email,
      "Password Reset",
      "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
        "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
        url +
        "\n" +
        "If you did not request this, please ignore this email and your password will remain unchanged.\n"
    );

    res
      .status(200)
      .send({ message: "An email has been sent to " + user.email + "!" });
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

// //  set new password
// const setNewPassword = async (req, res) => {
//   try {
//     if (!req.body.oldPassword || !req.body.newPassword) {
//       return res
//         .status(400)
//         .json({ message: "Old Password and New Password are required" });
//     }

//     if (!isValidPassword(req.body.newPassword)) {
//       return res.status(400).send({
//         message:
//           "Password must be between 8 and 26 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.",
//       });
//     }

//     const user = await Admin.findOne({ _id: req.params.id });
//     if (!user)
//       return res.status(400).send({ message: "Invalid link: User not found!" });

//     const token = await AdminToken.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token) return res.status(400).send({ message: "Token invalid!" });

//     // Change the password
//     await user.changePassword(req.body.oldPassword, req.body.newPassword);
//     await sendEmail(
//       user.email,
//       "Your password has been changed",
//       `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
//     );
//     await AdminToken.deleteOne({ _id: token._id }); // remove the token from the database

//     res.status(200).send({ message: "Password reset successful!" });
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };

const resetPassword = async (req, res) => {
  try {
    if (!req.body.password) {
      return res.status(400).json({ message: "New Password is required" });
    }

    if (!isValidPassword(req.body.password)) {
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

    // Step 3: Update user's password in the database
    user.setPassword(req.body.password, async (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }

      try {
        await user.save();
        await sendEmail(
          user.email,
          "Your password has been changed",
          `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
        );
        await AdminToken.deleteOne({ _id: token._id }); // remove the token from the database
        res.status(200).send({ message: "Password reset successful!" });
      } catch (err) {
        console.error(err);
        return res.status(500).send("Server error");
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export { sendPasswordResetLink, verifyPasswordResetLink, resetPassword };
