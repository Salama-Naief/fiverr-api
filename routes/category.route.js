import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, createCategory);
router.patch("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);
router.get("/", getCategories);

export default router;
