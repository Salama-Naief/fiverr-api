import Stripe from "stripe";
import StatusCode from "http-status-codes";
import gigModel from "../models/gig.model.js";
import orderModel from "../models/order.model.js";
//import orderModel from "../models/order.model.js";
import NotFoundError from "../error/not-found.error.js";
import CustomApiError from "../error/custom-api.error.js";
import BadRequestError from "../error/bad-request.error.js";

export const intent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET, {
    apiVersion: "2022-11-15",
  });
  const { gigId, qty, gigType } = req.body;

  const gig = await gigModel.findById(gigId);
  if (req.user.userId === gig.userId) {
    throw new BadRequestError("you can not by your gig");
  }
  if (!gig) {
    throw new NotFoundError("gig not found");
  }
  if (!qty) {
    qty = 1;
  }
  if (!gigType) {
    gigType = "Basic";
  }
  const gigPrice =
    gigType === "Premium"
      ? gig.Premium.price
      : gigType === "Standrad"
      ? gig.Standrad.price
      : gig.Basic.price;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: gigPrice * 100 * qty,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  if (!paymentIntent) {
    throw new CustomApiError("stripe error");
  }

  const order = new orderModel({
    gigId: gig._id,
    img: gig.coverImage,
    title: gig.title,
    price: gigPrice,
    qty: qty,
    totalPrice: gigPrice * qty,
    sellerId: gig.userId,
    buyerId: req.user.userId,
    payment_intent: paymentIntent.id,
  });

  await order.save();
  res.status(200).send({ clientSecret: paymentIntent.client_secret });
};

export const getOrders = async (req, res) => {
  const orders = await orderModel.find({
    ...(req.user.isSeller
      ? { sellerId: req.user.userId }
      : { buyerId: req.user.userId }),
    isCompleted: true,
  });

  if (!orders) {
    throw new NotFoundError("no orders found");
  }
  res.status(StatusCode.OK).json(orders);
};

export const confirm = async (req, res) => {
  const order = await orderModel.findOneAndUpdate(
    {
      payment_intent: req.body.payment_intent,
    },
    {
      $set: {
        isCompleted: true,
      },
    },
    { runValidators: true, new: true }
  );

  if (!order) {
    throw new NotFoundError("order not found");
  }
  await gigModel.findOneAndUpdate(
    { _id: order.gigId },
    { $inc: { sales: 1 }, $push: { buyers: order.buyerId } },
    { runValidators: true, new: true }
  );

  res.status(StatusCode.OK).json(order);
};
