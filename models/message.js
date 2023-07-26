const moment = require("moment");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("formatted_date").get(function () {
  return moment(this.timestamp).format("MMM Do, YYYY");
});

module.exports = mongoose.model("Message", MessageSchema);
