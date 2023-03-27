import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: [true, "user is required"],
    },
    gigId: {
      type: Schema.Types.ObjectId,
      ref: "Gig",
      require: [true, "user is required"],
    },
    rating: {
      type: Number,
      require: true,
      max: 5,
      min: 1,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.methods.calculateAverageRating = async function (gigId) {
  const result = await this.model("Review").aggregate([
    { $match: { gigId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Gig").findOneAndUpdate(
      { _id: gigId },
      {
        averageRating: result[0]?.averageRating.toFixed(1) || 0,
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {}
};

reviewSchema.post("save", async function () {
  await this.calculateAverageRating(this.gigId);
});

/*reviewSchema.post("findOneAndUpdate", async function () {
  await this.constructor.calculateAverageRating(this.gigId);
});
reviewSchema.pre("findOneAndDelete", async function () {
  await this.constructor.calculateAverageRating(this.gigId);
});
*/
export default mongoose.model("Review", reviewSchema);
