import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/bad-request.error.js";
import categoryModel from "../models/category.model.js";
import fileUplaod from "../utils/upload-images.js";

export const createCategory = async (req, res) => {
  if (!req.user.isSeller) {
    throw new BadRequestError("only sellers can create category");
  }
  if (req.files && req.files.image) {
    const image = await fileUplaod(req.files.image);
    const newCategory = new categoryModel({
      ...req.body,
      user: req.user.userId,
      image,
    });
    const category = await newCategory.save();
    res.status(StatusCodes.CREATED).json(category);
  } else {
    throw new BadRequestError("please fill all fields (title,subTitle,image)");
  }
};

export const updateCategory = async (req, res) => {
  const cat = await categoryModel.findById(req.params.id);
  if (!cat) {
    throw new NotFoundError(`category with id=${req.params.id} not found`);
  }
  if (req.user.userId !== cat.user) {
    throw new BadRequestError("you not allowed to update category");
  }
  if (req.files && req.files.image) {
    const image = await fileUplaod(req.files.image);
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { ...body, image },
      { runValidators: true, new: true }
    );
    res.status(StatusCodes.OK).json(category);
  } else {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { ...body },
      { runValidators: true, new: true }
    );
    res.status(StatusCodes.OK).json(category);
  }
};

export const deleteCategory = async (req, res) => {
  const cat = await categoryModel.findById(req.params.id);
  if (!cat) {
    throw new NotFoundError(`category with id=${req.params.id} not found`);
  }
  if (req.user.userId !== cat.user) {
    throw new BadRequestError("you not allowed to delete category");
  }

  await categoryModel.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.OK).json({ mag: "category deleted successfully" });
};

export const getCategories = async (req, res) => {
  const cat = await categoryModel.find();
  if (cat.length < 0) {
    throw new NotFoundError(`categories not found`);
  }
  res.status(StatusCodes.OK).json(cat);
};
