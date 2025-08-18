import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import "dotenv/config";

import User from "../models/user.model.js";

async function socialCallback(accessToken, refreshToken, profile, done) {
  try {
    let user = await User.findOne({
      provider: profile.provider,
      providerId: profile.id,
    });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        provider: profile.provider,
        providerId: profile.id,
        isVerified: true,
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}

// Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    },
    socialCallback
  )
);

// // GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    socialCallback
  )
);

// // Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    socialCallback
  )
);

// // LinkedIn
// passport.use(
//   new LinkedInStrategy(
//     {
//       clientID: process.env.LINKEDIN_CLIENT_ID,
//       clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
//       callbackURL: "/api/auth/linkedin/callback",
//       scope: ["r_emailaddress", "r_liteprofile"],
//     },
//     socialCallback
//   )
// );

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

export default passport;
