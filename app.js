var createError = require("http-errors");
const compression = require("compression");
const helmet = require("helmet");
var express = require("express");
var path = require("path");
var passport = require("passport");
const RateLimit = require("express-rate-limit");
const session = require("express-session");
require("dotenv").config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const passportConfig = require("./config/passportConfig");

var indexRouter = require("./routes/index");
var messageRouter = require("./routes/message");

var app = express();
// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
}

// Set up rate limiter: 20 requests per min
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 20,
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(limiter);
app.use(compression());
app.use(helmet());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
// Config passport
passportConfig(passport);

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use("/", indexRouter);
app.use("/", messageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
