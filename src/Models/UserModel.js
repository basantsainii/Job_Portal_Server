import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true, // Ensure first name is required
      trim: true,
    },
    lname: {
      type: String,
      required: true, // Ensure last name is required
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
      trim: true,
    },
    phone: {
      type: String, // Phone should be a string to prevent losing leading zeros
      required: false,
      minlength: 10,
      maxlength: 15, // Allow international numbers
      match: /^[0-9]+$/, // Ensure only digits
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Prevent leaking password by default
    },
    emailToken: {
      type: String,
      default: null,
      select: false,
    },
    isMailVerified: {
      type: Boolean,
      default: false,
    },
    Otp: {
      type: String,
      default: null,
      select: false,
    },
    role: {
      type: String,
      // enum: ["admin", "user"], // Enforce allowed roles
      default: null,
    },
    dp: {
      type: String,
      default: null,
    },
    resume: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserData", UserSchema);
export default UserData;
