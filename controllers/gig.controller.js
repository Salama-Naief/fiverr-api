import gigModel from "../models/gig.model.js";
import BadRequestError from "../error/bad-request.error.js";
import { StatusCodes } from "http-status-codes";
import uploadFiles from "../utils/upload-images.js";
import NotFoundError from "../error/not-found.error.js";

//find gigs
export const getGigs = async (req, res) => {
  const query = req.query;

  const filters = {
    ...(query.cat && { category: { $in: query.cat } }),
    ...(query.search && { title: { $regex: query.search, $options: "i" } }),
    ...((query.min || query.max) && {
      "Basic.price": {
        ...(query.min && { $gt: parseInt(query.min) }),
        ...(query.max && { $lt: parseInt(query.max) }),
      },
    }),
    ...(query.userId && { user: query.userId }),
  };

  const gigs = await gigModel
    .find(filters)
    .sort({ [query.sort]: -1 })
    .populate({ path: "user", select: "username email image" });

  res.status(StatusCodes.OK).json(gigs);
};

//find single gig
export const getGig = async (req, res) => {
  const { id } = req.params;

  const gig = await gigModel
    .findById(id)
    .populate({ path: "user", select: "-password" });
  if (!gig) {
    throw new NotFoundError(`gig with id=${id} is not found`);
  }
  res.status(StatusCodes.OK).json(gig);
};

//get my gigd
export const getMyGig = async (req, res) => {
  const gigs = await gigModel.find({ user: req.user.userId }).populate("user");

  res.status(StatusCodes.OK).json(gigs);
};
//create gig
export const createGig = async (req, res) => {
  let images = [];
  let coverImage = "";

  //check the gig creator is seller or not
  if (req.user.isSeller) {
    throw new BadRequestError("only seller can create gigs");
  }
  if (req.files && !req.files.coverImage) {
    throw new BadRequestError("please sellect cover image");
  }
  if (req.files && req.files.images) {
    images = await uploadFiles(req.files.images);
  }

  coverImage = await uploadFiles(req.files.coverImage);
  const newGig = await new gigModel.create({
    ...JSON.parse(req.body.data),
    user: req.user.userId,
    coverImage,
    images,
  }).populate("user");
  //const gig = await newGig.save();
  res.status(StatusCodes.CREATED).json(newGig);
};

//upadate gig
export const updateGig = async (req, res) => {
  const {
    params: { id },
    user,
    body,
  } = req;

  const gig = await gigModel.findById(id);
  if (!gig) {
    throw new NotFoundError("gig not found to update");
  }
  if (gig.user.toString() !== user.userId) {
    throw new BadRequestError("you can update only your gigs");
  }
  let images = gig.images;
  let coverImage = gig.coverImage;

  if (req.files && req.files.coverImage) {
    coverImage = await uploadFiles(req.files.coverImage);
  }
  if (req.files && req.files.images) {
    images = await uploadFiles(req.files.images);
  }

  const updatedGig = await gigModel
    .findOneAndUpdate(
      { _id: id, userId: user.userId },
      { ...JSON.parse(req.body.data), images, coverImage },
      { runValidators: true, new: true }
    )
    .populate("user");

  res.status(StatusCodes.OK).json(updatedGig);
};

//delete gig
export const deleteGig = async (req, res) => {
  const {
    params: { id },
    user,
  } = req;

  const gig = await gigModel.findById(id);
  if (!gig) {
    throw new NotFoundError("gig not found to delete");
  }
  if (gig.user.toString() !== user.userId) {
    throw new BadRequestError("you can delete only your gigs");
  }

  await gigModel.findOneAndDelete({ _id: id, userId: user.userId });

  res.status(StatusCodes.OK).json({ msg: "gig deleted successfully" });
};
