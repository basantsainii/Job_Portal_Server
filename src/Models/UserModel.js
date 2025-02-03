// importing model
import mongoose, { model } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      // required: true,
    },
    lname: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    //   select: false,
    },
    emailToken: {
        type: String,
        default: null,
    },

    isMailVerified: {
      type: Boolean,
      default: false,
    },
    Otp : {
      type: String,
      default: null,
    },
    role:{
      type : String,
      default: null,
    }  
  },
  {
    timestamps: true,
  }
);
const UserData = model("UserData", UserSchema);
export default UserData;
