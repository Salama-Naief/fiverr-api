import express from "express";
import { confirm, getOrders, intent } from "../controllers/order.controller.js";
import { limit } from "../utils/limit.js";

const router = express.Router();

router.post("/intent", intent);
router.patch("/confirm", confirm);
router.get("/", getOrders);

export default router;
