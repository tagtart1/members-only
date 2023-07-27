const User = require("../models/user");
const Message = require("../models/message");
const bcrypt = require("bcryptjs");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const passport = require("passport");

exports.home_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("author", "username first_name last_name")
    .exec();

  res.render("index", { title: "Express", messages: messages });
});

exports.sign_up_get = (req, res) => {
  res.render("sign-up", { errors: {} });
};

exports.sign_up_post = [
  // Validate and sanitize the fields
  body("firstName", "Enter a first name").trim().isLength({ min: 1 }).escape(),
  body("lastName", "Enter a last name").trim().isLength({ min: 1 }).escape(),
  body("email")
    .isEmail()
    .withMessage("Enter a valid email")
    .escape()
    .custom(async (input) => {
      const existingEmails = await User.countDocuments({ email: input });

      if (existingEmails > 0) {
        throw new Error("A user already exists with the e-mail address");
      }
    }),
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must at least 3 characters")
    .escape()
    .custom(async (input) => {
      const existingUsernames = await User.countDocuments({ username: input });
      if (existingUsernames > 0) {
        throw new Error("A user already exists with that username!");
      }
    }),
  body("password", "Password must be atleast 5 characters").isLength({
    min: 5,
  }),
  body("confirmPassword").custom(async (input, { req }) => {
    if (input !== req.body.password) {
      throw new Error("Passwords do not match!");
    }
  }),
  asyncHandler(async (req, res, next) => {
    //Extract errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign-up", { errors: errors.mapped() });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const newUser = new User({
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          membership_status: false,
        });
        await newUser.save();

        req.login(newUser, (err) => {
          if (err) {
            console.error(err);
            return next(err);
          }

          res.redirect("/");
        });
      });
    }
  }),
];

exports.log_in_get = (req, res, next) => {
  res.render("log-in");
};

exports.log_in_post = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // Failed to authenticate
      return res.render("log-in", { error: info.message });
    }
    // User is available, log them in
    req.login(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
};

exports.log_out_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.join_the_club_get = [
  // Ensure only authenticated users can access this page
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/log-in");
  },
  // Render the view
  (req, res) => {
    res.render("join-the-club");
  },
];

exports.join_the_club_post = [
  body("secretCode").escape(),
  body("permissionSelection", "Select what permission you want access to")
    .notEmpty()
    .escape(),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render("join-the-club", { errors: errors.array() });
    }

    if (req.body.permissionSelection === "membership") {
      // Secret code not correct, inform user dont give access
      if (req.body.secretCode !== process.env.SECRET_MEMBER_PASSCODE) {
        return res.render("join-the-club", { invalidCode: true });
      }

      // Secret code correct, change the users membership status
      await User.findByIdAndUpdate(req.user.id, {
        membership_status: true,
      });

      // Redirect to home page where user can now see authors and can create new messages
      return res.redirect("/");
    }

    if (req.body.permissionSelection === "admin") {
      // Secret code not correct, inform user dont give access
      if (req.body.secretCode !== process.env.SECRET_ADMIN_PASSCODE) {
        return res.render("join-the-club", { invalidCode: true });
      }

      await User.findByIdAndUpdate(req.user.id, {
        isAdmin: true,
      });

      return res.redirect("/");
    }
  }),
];
