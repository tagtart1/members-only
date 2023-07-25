var express = require("express");
var router = express.Router();

const auth_controller = require("../controllers/authController.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", auth_controller.sign_up_get);

router.post("/sign-up", auth_controller.sign_up_post);

router.get("/log-in", auth_controller.log_in_get);

router.post("/log-in", auth_controller.log_in_post);

router.get("/log-out", auth_controller.log_out_post);

module.exports = router;
