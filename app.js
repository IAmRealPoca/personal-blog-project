const express = require("express");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const authenticate = require("./authenticate");
const tokenAuth = require("./tokenAuth");
const auth = require("./auth");

const app = express();

// view engine setup
app.set("views", "./views");
app.set("view engine", "ejs");

// app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(authenticate); //use sau bodyparser va cookieparser
app.use(tokenAuth);

app.set("sessions", []);
// crypto.randomBytes(256, (err, buf) => {
//   console.log(buf.toString("hex"));
//   app.set("secretKey", buf.toString("hex"));
// });
app.set(
  "secretKey",
  "5894c958c18fe6bd2ec36dc08fc25928b22d4a420789622fa3a592ed3c24bfffcad3ea1f1227a4cf13715cf1bc09de3b14b98836ae8f70c1a8e68d2d5e6b65de5a0d5637370c4ea9d4d656a5576752369415dd241383a7dc1dc94da3caf2d2ec41a8214716b4db47583761b36c349cded46ad4d1712b18323c1e22a67e6d67c7794d9034b9126ea6378c89d8da4f369aee2669c7f0204d0ac8125fec02eb9cdf07eaf16b68a492941f173f549d6baab34192cb5963c7f7b5c568eef024a73631b99aad23d2b44cbbb081e8c9b5c900ea101eee48516805c5f29f97e45b2d03221ffc6d85b95b319f0a9e3320afd1d32efacc05d86cf76387ff77527fb524a9d2"
);

//mongoose config
mongoose.connect(
  "mongodb+srv://nyamiv:eG8VJYnwYXNgJZg@cluster0.z3hhr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
mongoose.connection.on("connected", () => {
  console.log("Mongo Atlas Connected.");
});
mongoose.connection.on("err", (err) => {
  console.log("Mongo Atlas connection error: ", err);
});

//mongoose models
const userModel = require("./models/user-model");
const blogModel = require("./models/blog-model");
const { ppid } = require("process");

//main page
app.get("/", (req, res) => {
  console.log("req.username: ", req.user.username);
  // let username = null;
  // if (req.cookies && req.cookies.id) {
  //   let users = req.app.get("sessions").filter((s) => s.id === req.cookies.id);
  //   if (users.length) username = users[0].username;
  // }
  res.render("index", { username: req.user.username });
});

//users
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  let user = await userModel.findOne({ username: req.body.username });
  if (user) {
    res.send(`Username is used by another user`);
  } else {
    let salt = await crypto.randomBytes(50);
    salt = salt.toString("hex");
    let h = crypto.createHmac("sha256", salt);
    h = h.digest("hex");
    const newUser = await userModel.create({
      username: req.body.username,
      hashedPass: h,
      salt: salt,
    });
    if (newUser) {
      res.redirect("/login");
    } else {
      res.send("bad req");
    }
  }
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  let user = await userModel.findOne({
    username: req.body.username,
  });
  if (user) {
    let h = crypto.createHmac("sha256", user.salt);
    h = h.digest("hex");
    if (h === user.hashedPass) {
      // let sessionId = crypto.randomBytes(10);
      // sessionId = sessionId.toString("hex");
      // req.app.get("sessions").push({
      //   id: sessionId,
      //   username: user.username,
      // });
      // res.cookie("id", sessionId);

      let token = jwt.sign(
        { id: user._id, username: user.username },
        req.app.get("secretKey")
      );
      res.cookie("token", token);
      res.redirect("/");
    } else {
      res.send(`${user.username} logins fail. Wrong pass`);
    }
  } else {
    res.send(`${user.username} logins fail.`);
  }
});
//end users

//blogs
app.get("/blog", async (req, res) => {
  //populate to get createdBy user infos
  //so we can display the username/fullname of createdBy user
  const resp = await blogModel.find().populate("createdBy");
  res.render("blog/blog", { blogs: resp, title: "Blog" });
});

app.get(
  "/blog/add-blog",
  auth(async (req, res) => {
    res.render("blog/add-blog", { title: "Create blog" });
  })
);

app.post(
  "/blog/add-blog",
  auth(async (req, res) => {
    const currUser = await userModel.findById(req.user.id);
    if (currUser) {
      const newPost = await blogModel.create({
        title: req.body.title,
        content: req.body.content,
        createdAt: new Date(),
        createdBy: currUser.id,
      });
      if (newPost) {
        res.redirect("/blog");
      } else {
        res.send("Failed to create new post");
      }
    } else {
      res.send("Failed to create new post: user not valid");
    }
  })
);

app.get(
  "/blog/:id/edit-blog",
  auth(async (req, res) => {
    const user = await userModel.findById(req.user.id);
    const currPost = await blogModel.findById(req.params.id);
    if (!currPost) {
      res.send("BLOG NOT FOUND");
      return;
    }
    if (!user) {
      res.render("forbidden");
      return;
    }
    //createdBy is saving ObjectId
    // toString() to get the value of ObjectId, otherwise the following condition is always false
    if (currPost.createdBy.toString() !== user.id) {
      res.render("forbidden");
      return;
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
  })
);

app.post(
  "/blog/:id/edit-blog",
  auth(async (req, res) => {
    const currPost = await blogModel.findById(req.params.id);
    if (!currPost) {
      res.send("NONE");
    }
    const user = await userModel.findById(req.user.id);
    if (!user) {
      res.render("forbidden");
      return;
    }
    if (currPost.createdBy.toString() !== user.id) {
      res.render("forbidden");
      return;
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
  })
);

app.get("/blog/:id/delete-blog", auth(async (req, res) => {
  const currPost = await blogModel.findById(req.params.id);
  if (!currPost) {
    res.send("NONE");
  }
  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.render("forbidden");
    return;
  }
  if (currPost.createdBy.toString() !== user.id) {
    res.render("forbidden");
    return;
  }
  const result = await blogModel.deleteOne({ _id: req.params.id });
  if (result) {
    res.redirect("/blog");
  }
}));
//end blogs

app.listen(3001, () => {
  console.log("Listening on port 3000");
});
