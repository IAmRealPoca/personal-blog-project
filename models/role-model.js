const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    name: String,
});
const roleModel = mongoose.model("Role", roleSchema);

module.exports = roleModel;