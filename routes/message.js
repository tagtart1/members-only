var express = require("express");
var router = express.Router();

const message_controller = require("../controllers/messageController");

router.get("/create-message", message_controller.create_message_get);

router.post("/create-message", message_controller.create_message_post);

module.exports = router;
