import express from "express";
import {
  signupVerification,
  enter_OTP,
  getNameAndEmail,
  getAllUsers,
  createUser,
  updateMe,
  getUser,
  updateUser,
  deleteUser,
} from "../../controllers/appControllers/userController.js";
import {
  signup,
  login,
  protect,
  updatePassword,
} from "../../controllers/appControllers/authController.js";

const router = express.Router();

router.post("/verification", signupVerification);
router.post("/OTP", enter_OTP);
router.post("/signup", getNameAndEmail, signup);

router.post("/login", login);

router.route("/").get(getAllUsers).post(createUser);

router.patch("/updateMyPassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
