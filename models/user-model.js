const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  age: Number,
  hashedPass: String,
  salt: String,
  // roles: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Role",
  // },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
