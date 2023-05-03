// import * as dotenv from "dotenv";
// dotenv.config();

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "320489601196-n64kjtci86p19g9okhpkf45jmsontqag.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
