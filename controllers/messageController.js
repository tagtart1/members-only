const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Get the home page
exports.home_get = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("author", "username first_name last_name")
    .exec();

  res.render("index", { title: "Member's Only - Home", messages: messages });
});

exports.create_message_get = [
  // Ensure only authenticated users can access this page
  (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/log-in");
  },
  (req, res, next) => {
    res.render("create-message", { errors: {}, title: "Create A Message" });
  },
];

exports.create_message_post = [
  body("title", "Must include title").trim().isLength({ min: 1 }).escape(),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Must have a message")
    .isLength({ max: 500 })
    .withMessage("Messages can only be 500 characters long!")
    .escape(),
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);

    const message = {
      title: req.body.title,
      text: req.body.text,
      author: req.user.id,
    };

    if (!errors.isEmpty()) {
      res.render("create-message", {
        errors: errors.mapped(),
        text: message.text,
        titleText: message.title,
        title: "Create A Message",
      });
    } else {
      const newMessage = new Message(message);

      await newMessage.save();

      res.redirect("/");
    }
  }),
];

exports.delete_message_post = [
  body("messageId").escape(),
  asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.body.messageId);

    res.redirect("/");
  }),
];
