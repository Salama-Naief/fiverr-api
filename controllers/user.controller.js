import userModel from "../models/user.model.js";
import NotFoundError from "../error/not-found.error.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/bad-request.error.js";
import clearCookie from "../utils/clearCookie.js";
import uploadFiles from "../utils/upload-images.js";

//find single user by id
export const findUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findById(id);

  if (!user) {
    throw new NotFoundError("user not found");
  }

  const { password, ...others } = user._doc;
  res.status(StatusCodes.OK).json(others);
};

//find all seller usres
export const findSeller = async (req, res) => {
  const users = await userModel.find({ isSeller: true });

  if (users.length <= 0) {
    throw new NotFoundError("seller not found ");
  }
  const sellerUsers = users.map((user) => {
    const { password, ...others } = user._doc;
    return others;
  });
  res.status(StatusCodes.OK).json(sellerUsers);
};

//find all buyer usres
export const findBuyer = async (req, res) => {
  const users = await userModel.find({ isSeller: false });

  if (users.length <= 0) {
    throw new NotFoundError("buyer not found ");
  }
  const buyerUsers = users.map((user) => {
    const { password, ...others } = user._doc;
    return others;
  });
  res.status(StatusCodes.OK).json(buyerUsers);
};

//get me
export const getMe = async (req, res) => {
  if (!req.user) {
    throw new BadRequestError("not authentacated");
  }

  const user = await userModel.findById(req.user.userId);

  if (!user) {
    throw new NotFoundError("user not found");
  }

  const { password, ...others } = user._doc;

  res.status(StatusCodes.OK).json(others);
};

//update user

export const updateUser = async (req, res) => {
  let image = "";
  let user = null;
  const {
    params: { id },
    user: { userId },
    body,
  } = req;
  if (id !== userId) {
    throw new BadRequestError("you can update only your account");
  }
  if (req.files && req.files.image) {
    image = await uploadFiles(req.files.image);
    user = await userModel.findByIdAndUpdate(
      userId,
      { ...body, image },
      { runValidators: true, new: true }
    );
  } else {
    user = await userModel.findByIdAndUpdate(
      userId,
      { ...body },
      { runValidators: true, new: true }
    );
  }

  const { password, ...others } = user._doc;
  const token = user.createJwt();

  res.cookie("token", token).status(StatusCodes.OK).json({ user: others });
};

//delete user

export const deleteUser = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;
  if (id !== userId) {
    throw new BadRequestError("you can update only your account");
  }
  await userModel.findByIdAndDelete(userId);

  clearCookie(res);
  res.status(StatusCodes.OK).json({ msg: "user is deleted" });
};
