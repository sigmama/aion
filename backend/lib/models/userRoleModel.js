const mongoose = require("mongoose");

const userRoleSchema = new mongoose.Schema({
  role: { type: String }
});

module.exports = mongoose.model("UserRole", userRoleSchema, "userRoles");
