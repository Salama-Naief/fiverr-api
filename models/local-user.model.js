import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import userModel from "./user.model.js";
const { Schema } = mongoose;

const LocalUserSchema = new Schema({
  password: {
    type: String,
    trim: true,
    minLength: 8,
    required: [true, "password length is must be larger than 8"],
  },
});

LocalUserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

LocalUserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default userModel.discriminator("localUser", LocalUserSchema);
