import mongoose from "mongoose";

const { Schema } = mongoose;

const conversationShema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    readBySeller: {
      type: String,
      required: true,
    },
    readByBuyer: {
      type: String,
      required: true,
    },
    lastMessage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationShema);
