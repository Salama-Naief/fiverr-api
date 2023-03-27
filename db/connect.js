import mongoose from "mongoose";

export default function () {
  return mongoose.connect(process.env.MONGODB_URL);
}
