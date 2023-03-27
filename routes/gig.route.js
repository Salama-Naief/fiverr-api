import express from "express";
import {
  createGig,
  updateGig,
  deleteGig,
  getGigs,
  getGig,
  getMyGig,
} from "../controllers/gig.controller.js";
import auth from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", auth, createGig);
router.patch("/:id", auth, updateGig);
router.delete("/:id", auth, deleteGig);
router.get("/gig/:id", getGig);
router.get("/", getGigs);
router.get("/my", auth, getMyGig);
export default router;
