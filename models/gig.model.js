import mongoose from "mongoose";

const { Schema } = mongoose;

const serviceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: Number,
    required: true,
  },
  revisionNumber: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  price: {
    type: Number,
    required: [true, "plaese enter the price"],
  },
});
const gigSchema = new Schema(
  {
    userId: {
      required: [true, "seller is required"],
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "please enter the title"],
      trim: true,
      minLength: [3, "title must be more than 3 char"],
    },
    description: {
      type: String,
      required: [true, "please enter the description"],
      minLength: [3, "description must be more than 3 char"],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: [String],
      required: true,
    },

    coverImage: {
      type: String,
      required: [true, "cover image must be enter"],
    },
    images: {
      type: [String],
    },
    Basic: {
      type: serviceSchema,
      required: true,
    },
    Premium: {
      type: serviceSchema,
      required: true,
    },
    Standrad: {
      type: serviceSchema,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
    buyers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Gig", gigSchema);
