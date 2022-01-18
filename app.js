var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var mongoose = require("mongoose");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var blogsRouter = require("./routes/blogs");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/blog", blogsRouter);

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen(3000, () => {
  console.log("Listening on port 3000");
  console.log("Created using express-generator");
});
