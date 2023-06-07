import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },

  photo: {
    type: String,
    default: `http://res.cloudinary.com/cheki/image/upload/v1684309596/ietnmi5axvciw3dnornw.jpg`,
  },

  dob: {
    type: String,
    required: [true, "Enter Your date of birth"],
  },

  country: {
    type: String,
    required: [true, "Please provide a country!"],
  },

  profession: {
    type: String,
    required: [true, "Please provide a profession!"],
  },
  photo: {
    type: String,
    default: `https://res.cloudinary.com/cheki/image/upload/v1685611183/DrukEBird/UserProfile/t81wqdwevcbkhu1wdl7u.jpg`,
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    // select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },

  active: {
    type: Boolean,
    default: true,
    // select: false,
  },
});

// mongooose middleware

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  //this.password = await bcrypt.hash(this.password,process.env.PASSWORD_HASH_KEY)
  this.password = await bcrypt.hash(this.password, 12);

  //Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// userSchema.path('dob').validate(function (dob) {
//     var dobRegex = /^(0[1-9]|[1-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
//     return dobRegex.test(dob);
// }, 'Enter DoB in DD/MM/YYYY');

userSchema.path("password").validate(function (password) {
  var passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  if (password.length < 8) {
    throw new Error("Enter a password more than 8 characters.");
  } else if (!/[a-z]/.test(password)) {
    throw new Error("Enter at least one lowercase letter.");
  } else if (!/[A-Z]/.test(password)) {
    throw new Error("Enter at least one uppercase letter.");
  }

  return passwordRegex.test(password);
});

//Instance method is available in all document of certain collection while login
userSchema.methods.correctPassword = async function (
  candidatePassword, //Password that user pass
  userPassword //password that store in the database
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (
    update.password !== "" &&
    update.password !== undefined &&
    update.password == update.passwordConfirm
  ) {
    this.getUpdate().password = await bcrypt.hash(update.password, 12);

    //Delete passwordConfirm Field
    update.passwordConfirm = undefined;
    next();
  } else next();
});

const User = mongoose.model("User", userSchema);
export default User;
