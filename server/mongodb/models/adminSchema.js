import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
import findOrCreate from "mongoose-findorcreate";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email field is required"],
      unique: [true, "Email should be unique"],
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address" ],
    },
    name: { type: String, required: false },
    password: String,
    country: { type: String, required: false },
    userType: { type: String, default: "user" },
    googleId: String,
    profile: String,
  },
  { _id: true, timestamps: true }
);

adminSchema.plugin(passportLocalMongoose, { usernameField: "email" });
adminSchema.plugin(findOrCreate);

const Admin = new mongoose.model("Admin", adminSchema);

export { Admin };
