import userModel from "../models/user.model.js";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../error/bad-request.error.js";

export const register = async (req, res) => {
  const user = await userModel.create({
    ...req.body,
  });
  delete user.password;
  const token = await user.createJwt();

  res.cookie("token", token).status(StatusCodes.CREATED).json({ user });
};

export const login = async (req, res) => {
  const { password: canditatePassword, email } = req.body;
  if (!canditatePassword || !email) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new BadRequestError("Invalid Credentials");
  }

  const isMatch = await user.comparePassword(canditatePassword);

  if (!isMatch) {
    throw new BadRequestError("Invalid Password");
  }

  const { password, ...others } = user._doc;
  const token = await user.createJwt();

  res.cookie("token", token).status(StatusCodes.CREATED).json({ user: others });
};

export const logout = (req, res) => {
  /* clearCookie(res);
  res.status(StatusCodes.OK).json({ msg: "user logedout" });
  */
  req.logout(function (err) {
    if (err) {
      throw new BadRequestError("server error");
    }
    res.status(200).json({ msg: "logout successfully" });
  });
};
