import fs from "fs";
import cloudinary from "cloudinary";
import BadRequestError from "../error/bad-request.error.js";
const uploadFiles = async (file) => {
  //check the files is single file or multifiles
  if (file.length) {
    const images = [];
    for (const image of file) {
      if (
        image.mimetype === "image/png" ||
        image.mimetype === "image/jpg" ||
        image.mimetype === "image/webp" ||
        image.mimetype === "image/jpeg"
      ) {
        const url = await cloudinary.v2.uploader.upload(image.tempFilePath, {
          use_filename: true,
          folder: "fiverr",
        });
        fs.unlinkSync(image.tempFilePath);
        images.push(url.secure_url);
      } else {
        throw new BadRequestError(
          `invalid file ${image.mimetype} the image type must be .png or .jpg or .webp or .jpeg`
        );
      }
    }
    return images;
  } else {
    //check the type of image
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/webp" ||
      file.mimetype === "image/jpeg"
    ) {
      const url = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        use_filename: true,
        folder: "fiverr",
      });
      fs.unlinkSync(file.tempFilePath);
      return url.secure_url;
    } else {
      throw new BadRequestError(
        `invalid file ${file.mimetype} the image type must be .png or .jpg or .webp or .jpeg`
      );
    }
  }
};

export default uploadFiles;
