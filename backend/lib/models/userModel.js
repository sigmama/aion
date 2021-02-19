const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userEid: { type: String, minlength: 7, maxlength: 7 },
  nickName: { type: String },
  mail: { type: String },
  role: { type: String },
  systems: { type: Array },
  isActive: { type: Boolean }
});

module.exports = mongoose.model("User", userSchema);
