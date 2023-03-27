import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { Schema } = mongoose;

const langSchema = new Schema({
  languge: {
    type: String,
    default: "english",
  },
  level: {
    type: String,
    default: "basic",
  },
});
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minLength: [3, "username must greater than 3"],
    },
    providerId: {
      type: String,
      default: "",
    },
    registerType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      minLength: 3,
      required: [true, "please enter the email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    /*  password: {
      type: String,
      trim: true,
      minLength: 8,
      required: [true, "password length is must be larger than 8"],
    },*/
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dlttbpnxw/image/upload/v1678475237/fiverr/tmp-1-1678475221778_jrsei5.jpg",
    },
    country: {
      type: String,
      minLength: [3, "username must greater than 3"],
    },
    phone: {
      type: Number,
    },
    isSeller: {
      type: Boolean,
      default: false,
    },
    story: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    languages: [langSchema],
  },
  { timestamps: true, discriminatorKey: "kind" }
);

userSchema.methods.createJwt = function () {
  return jwt.sign(
    { userId: this._id, isSeller: this.isSeller },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

/*userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};*/

export default mongoose.model("User", userSchema);
