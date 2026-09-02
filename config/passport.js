const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/queries");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (identifier, password, done) => {
    try {
      const user = await db.getUserByIdentifier(identifier);
      if (!user) {
        return done(null, false, { message: "Wrong username or email" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Wrong password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    return done(err);
  }
});

module.exports = passport;
