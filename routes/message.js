var express = require("express");
var router = express.Router();

const message_controller = require("../controllers/messageController");

/* GET home page. */
router.get("/", message_controller.home_get);

router.get("/create-message", message_controller.create_message_get);

router.post("/create-message", message_controller.create_message_post);

router.post("/delete-message", message_controller.delete_message_post);

module.exports = router;
