import express from "express";
import {
  creatReview,
  deleteReview,
  getGigReviews,
  updateReview,
} from "../controllers/review.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", auth, creatReview);
router.patch("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);
router.get("/:id", getGigReviews);

export default router;
