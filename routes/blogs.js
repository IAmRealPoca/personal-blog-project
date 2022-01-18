var express = require("express");
var router = express.Router();
const blogModel = require("../models/blog-model");

router.get("/", async (req, res, next) => {
  const resp = await blogModel.find();
  res.render("blog/blog", { blogs: resp, title: "Blog" });
});

router.get("/add-blog", async (req, res, next) => {
  res.render("blog/add-blog", { title: "Create blog" });
});

router.post("/add-blog", async (req, res, next) => {
  const newPost = await blogModel.create({
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date(),
  });
  if (newPost) {
    res.redirect("/blog");
  } else {
    res.send("Failed to create new post");
  }
});

router.get("/:id/edit-post", async (req, res, next) => {
  const currPost = await blogModel.findById(req.params.id);
  if (!currPost) {
    res.send("BLOG NOT FOUND");
  }
  res.render("blog/edit-blog", {
    blog: {
      id: currPost.id,
      title: currPost.title,
      content: currPost.content,
      createdAt: currPost.createdAt,
    },
    title: "Edit blog",
  });
});

router.post("/:id/edit-post", async (req, res, next) => {
  const currPost = await blogModel.findById(req.params.id);
  if (!currPost) {
    res.send("NONE");
  }
  const newPost = await blogModel.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date(),
  });
  if (newPost) {
    res.redirect("/blog");
  } else {
    res.send("Failed to edit post");
  }
});

router.get("/:id/delete-post", async (req, res, next) => {
  const currPost = await blogModel.findById(req.params.id);
  if (!currPost) {
    res.send("NONE");
  }
  const result = await blogModel.deleteOne({ _id: req.params.id });
  if (result) {
      
  }
});

module.exports = router;
