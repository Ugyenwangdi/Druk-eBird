// import mongoose from "mongoose";
// import passportLocalMongoose from "passport-local-mongoose";
// import findOrCreate from "mongoose-findorcreate";

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, "Email field is required"],
//     unique: [true, "Email should be unique"],
//     match: /^\S+@\S+\.\S+$/,
//   },
//   name: { type: String, required: false },
//   password: String,
//   country: { type: String, required: false },
//   userType: { type: String, default: "user" },
//   googleId: String,
// });

// userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// userSchema.plugin(findOrCreate);

// const User = new mongoose.model("User", userSchema);

// export { User };
