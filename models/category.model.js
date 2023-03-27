import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cat: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Category", categorySchema);
