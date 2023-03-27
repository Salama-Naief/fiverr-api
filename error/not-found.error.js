import { StatusCodes } from "http-status-codes";
import CustomApiError from "./custom-api.error.js";

export default class NotFoundError extends CustomApiError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.NOT_FOUND;
  }
}
