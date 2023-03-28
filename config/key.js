import dotenv from "dotenv";
dotenv.config();

export const keys = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
      "https://fiverr-api-xv0o.onrender.com/api/auth/google/callback",
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL:
      "https://fiverr-api-xv0o.onrender.com/api/auth/facebook/callback",
  },
  frontendUri: process.env.FRONTEND_URI,
};
