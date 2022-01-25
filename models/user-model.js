const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  fullname: String,
  email: String,
  age: Number,
  hashedPass: String,
  salt: String,
  // roles: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Role",
  // },
  role: String,
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
