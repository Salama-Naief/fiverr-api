import jwt from "jsonwebtoken";
import CustomApiError from "../error/custom-api.error";
const CreateToken = (payload) => {
  const { id, isSeller } = payload;
  const token = jwt.sign({ id, isSeller }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  if (!token) {
    throw new CustomApiError("somer=thing went wrong", 500);
  }
  return token;
};

export default CreateToken;
