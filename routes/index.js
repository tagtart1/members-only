var express = require("express");
var router = express.Router();

const auth_controller = require("../controllers/authController.js");

/* GET home page. */
router.get("/", auth_controller.home_get);

router.get("/sign-up", auth_controller.sign_up_get);

router.post("/sign-up", auth_controller.sign_up_post);

router.get("/log-in", auth_controller.log_in_get);

router.post("/log-in", auth_controller.log_in_post);

router.get("/log-out", auth_controller.log_out_get);

router.get("/join-the-club", auth_controller.join_the_club_get);

router.post("/join-the-club", auth_controller.join_the_club_post);

module.exports = router;
