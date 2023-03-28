import passport from "passport";
import googleOAuth from "passport-google-oauth20";
import facebookOAuth from "passport-facebook";
import localOAuth from "passport-local";
import { keys } from "../config/key.js";
import localUserModel from "../models/local-user.model.js";
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

const GoogleStrategy = googleOAuth.Strategy;
const LocalStrategy = localOAuth.Strategy;
const FacebookStrategy = facebookOAuth.Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  done(null, user);
});

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async function (req, email, password, done) {
      const exsistUser = await userModel.findOne({ email: email });

      if (exsistUser) {
        return done({ msg: "the user is registerd already" });
      }
      const newUser = new localUserModel({
        email: email,
        username: req.body.username,
        password: password,
        registerType: "local",
      });
      try {
        const user = await newUser.save();
        done(null, { userId: user._id, isSeller: user.isSeller });
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      const user = await localUserModel.findOne({
        email: email,
        registerType: "local",
      });

      if (!user) {
        return done({ msg: "user not found please register frist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done({ msg: "passwrod is wrong" });
      }

      done(null, { userId: user._id, isSeller: user.isSeller });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.clientSecret,
      callbackURL: keys.google.callbackURL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await userModel.findOne({ providerId: profile.id });

      if (!user) {
        const newUser = new userModel({
          username: profile.displayName,
          email: profile.emails[0].value,
          providerId: profile.id,
          registerType: profile.provider,
        });
        try {
          const userSaved = await newUser.save();
          done(null, { userId: userSaved._id, isSeller: userSaved.isSeller });
        } catch (error) {
          done(error, null);
        }
      } else {
        done(null, { userId: user._id, isSeller: user.isSeller });
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.facebook.clientID,
      clientSecret: keys.facebook.clientSecret,
      callbackURL: keys.facebook.callbackURL,
      profileFields: [
        "id",
        "displayName",
        "name",
        "picture.type(large)",
        "email",
      ],
    },
    async function (accessToken, refreshToken, profile, done) {
      const user = await userModel.findOne({ providerId: profile.id });

      if (!user) {
        const newUser = new userModel({
          username: profile.displayName,
          email: profile.emails[0].value,
          providerId: profile.id,
          registerType: profile.provider,
        });
        try {
          const userSaved = await newUser.save();
          done(null, { userId: userSaved._id, isSeller: userSaved.isSeller });
        } catch (error) {
          done(error, null);
        }
      } else {
        done(null, { userId: user._id, isSeller: user.isSeller });
      }
    }
  )
);

export default passport;
