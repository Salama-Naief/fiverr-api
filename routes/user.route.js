import express from "express";
import {
  findBuyer,
  findSeller,
  findUser,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/:id", findUser);
router.get("/sellers", findSeller);
router.get("/me", auth, getMe);
router.get("/buyers", findBuyer);
router.patch("/:id", auth, updateUser);
router.delete("/:id", auth, deleteUser);
export default router;
