import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, default: "user" },
  },
  { _id: true, timestamps: true }
);

adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

const validateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    country: Joi.string().required().label("Last Name"),
    password: passwordComplexity().required().label("Password"),
    userType: Joi.string(),
  });
  return schema.validate(data);
};

export { Admin, validateUser };
