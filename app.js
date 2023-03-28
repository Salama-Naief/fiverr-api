import express from "express";
import dotenv from "dotenv";
import expressErrorHandler from "express-async-errors";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";
import cors from "cors";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import passport from "passport";
import session from "express-session";

import connect from "./db/connect.js";
import notFound from "./middleware/not-found.middleware.js";
import errorHandlerMiddleware from "./middleware/error-handler.middleware.js";
import auth from "./middleware/auth.middleware.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import reviewRoute from "./routes/review.route.js";
import categoryRoute from "./routes/category.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messagesRoute from "./routes/message.route.js";
import passportSetup from "./services/passport.js";
const app = express();
expressErrorHandler;
passportSetup;
//port
const port = process.env.PORT || 5000;

//config
dotenv.config();
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(cookieParser());
app.use(
  session({ resave: false, saveUninitialized: true, secret: "secretsession" })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload({ useTempFiles: true }));
app.use(
  cors({
    origin: [
      "https://fiverr-client-two.vercel.app/",
      "https://fiverr-7yos.onrender.com/",
      "https://api.stripe.com",
      "https://accounts.google.com",
    ],
    credentials: true,
  })
);

// routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/orders", auth, orderRoute);
app.use("/api/conversations", auth, conversationRoute);
app.use("/api/messages", auth, messagesRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);
const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
