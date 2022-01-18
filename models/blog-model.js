const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    content: String,
    createdAt: Date,
    // createdBy: ???

    // name: String,
    // email: String,
    // age: Number,
    // hashedPass: String,
    // salt: String,
});

const blogModel = mongoose.model("Blog", blogSchema);

module.exports = blogModel;