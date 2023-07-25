const User = require("../models/user");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.sign_up_get = (req, res) => {
  res.render("sign-up");
};

exports.sign_up_post = (req, res, next) => {
  res.send("WIP sign up post");
};

exports.log_in_get = (req, res, next) => {
  res.send("WIP log in get");
};
exports.log_in_post = (req, res, next) => {
  res.send("WIP log in post");
};
exports.log_out_get = (req, res, next) => {
  res.send("WIP lost out get");
};
