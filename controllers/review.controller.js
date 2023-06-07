import StatusCode from "http-status-codes";
import reviewModel from "../models/review.model.js";
import gigModel from "../models/gig.model.js";
import BadRequestError from "../error/bad-request.error.js";
import NotFoundError from "../error/not-found.error.js";

//crate review
export const creatReview = async (req, res) => {
  const { body, user } = req;

  const existReview = await reviewModel.findOne({
    user: user.userId,
    gigId: body.gigId,
  });
  const isValildGig = await gigModel.findOne({ _id: body.gigId });
  if (!isValildGig) {
    throw new NotFoundError(`gig with id=${body.gigId} is not found!`);
  }
  if (existReview) {
    throw new BadRequestError("Already submitted review for this gig!");
  }
  const newReview = new reviewModel({
    ...body,
    user: user.userId,
  });
  const review = await newReview.save();
  res.status(StatusCode.CREATED).json(review);
};

//update review
export const updateReview = async (req, res) => {
  const {
    body,
    params: { id },
    user,
  } = req;

  const review = await reviewModel.findOne({
    _id: id,
  });
  if (!review) {
    throw new NotFoundError(`no review found by id=${id}`);
  }
  if (review.user.toString() !== user.userId) {
    throw new BadRequestError("you can update only your reviews");
  }
  const updatedReview = await reviewModel.findOneAndUpdate(
    { _id: id, user: user.userId },
    { desc: body.desc, rating: body.rating },
    { runValidators: true, new: true }
  );
  await updatedReview.calculateAverageRating(updatedReview.gigId);
  res.status(StatusCode.OK).json(updatedReview);
};

//find review
export const getGigReviews = async (req, res) => {
  const { params } = req;
  const gigReviews = await reviewModel
    .find({ gigId: params.id })
    .populate({ path: "user", select: "-password" });
  if (!gigReviews) {
    throw new NotFoundError("no reviews for this gig");
  }
  res.status(StatusCode.OK).json(gigReviews);
};

export const deleteReview = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;
  const review = await reviewModel.findById(id);
  if (!review) {
    throw new NotFoundError(`no review found by this id=${id}`);
  }
  if (review.user.toString() !== userId) {
    throw new BadRequestError("you can delete only your reviews");
  }

  await reviewModel.findOneAndDelete({ _id: id });
  await review.calculateAverageRating(review.gigId);
  res.status(StatusCode.OK).json({ msg: "your review is deleted" });
};
