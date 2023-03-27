import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.error.js";

export default class BadRequestError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
