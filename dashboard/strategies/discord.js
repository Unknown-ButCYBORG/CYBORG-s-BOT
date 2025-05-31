const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;
const config = require("../../config.json");

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new DiscordStrategy(
  {
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackURL,
    scope: ["identify", "guilds"]
  },
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(() => done(null, profile));
  }
));
