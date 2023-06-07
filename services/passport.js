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
  console.log("serializeUser", user);
  done(null, user);
});

passport.deserializeUser(async (user, done) => {
  console.log("deserializeUser", user);
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
      const exsistUser = await localUserModel.findOne({ email: email });
      console.log("exsistUser", exsistUser);
      console.log("exsistUser", email);
      if (exsistUser) {
        return done(new Error("this email is already registerd!"));
      }
      const newUser = new localUserModel({
        email: email,
        username: req.body.username,
        password: password,
        registerType: "local",
      });
      try {
        const user = await newUser.save();
        console.log("saved user", user);
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
        email,
      });

      console.log("user logedin", user);
      if (!user) {
        return done(new Error("this email is not registerd!"));
        //return done(null, false, "this email is not registerd!");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("ismatch", isMatch);
      if (!isMatch) {
        return done(new Error("passwrod is wrong or email"));
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
