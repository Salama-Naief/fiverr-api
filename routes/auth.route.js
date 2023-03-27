import express from "express";
import passport from "passport";
import { login, logout, register } from "../controllers/auth.controller.js";
import { keys } from "../config/key.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.post(
  "/local/login",
  passport.authenticate("local-login", {}),
  (req, res) => {
    res.redirect(`/api/users/me`);
  }
);

router.post(
  "/local/register",
  passport.authenticate("local-signup", {}),
  (req, res) => {
    res.redirect(`/api/users/me`);
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: keys.frontendUri,
    failureRedirect: `${keys.frontendUri}/login`,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.send("google done");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: keys.frontendUri,
    failureRedirect: `${keys.frontendUri}/login`,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.send("facebook done");
  }
);
export default router;
