const User = require("../models/user");
const bcrypt = require("bcryptjs");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.sign_up_get = (req, res) => {
  res.render("sign-up", { errors: {} });
};

exports.sign_up_post = [
  // Validate and sanitize the fields
  body("firstName", "Enter a first name").trim().isLength({ min: 1 }).escape(),
  body("lastName", "Enter a last name").trim().isLength({ min: 1 }).escape(),
  body("email")
    .isEmail()
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
      console.log("ERRORS");
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
        res.redirect("/");
      });
    }
  }),
];

exports.log_in_get = (req, res, next) => {
  res.send("WIP log in get");
};
exports.log_in_post = (req, res, next) => {
  res.send("WIP log in post");
};
exports.log_out_get = (req, res, next) => {
  res.send("WIP lost out get");
};
