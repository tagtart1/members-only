const User = require("../models/user");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }

        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // Pass
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser(function (user, done) {
    console.log(user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id);
      console.log("DESERIALIZE");
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
