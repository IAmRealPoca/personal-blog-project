const jwt = require("jsonwebtoken");
function tokenAuth(req, res, next) {
  let id = null;
  let username = null;
  if (req.cookies && req.cookies.token) {
    try {
      let user = jwt.verify(req.cookies.token, req.app.get("secretKey"));
      id = user.id;
      username = user.username;
    } catch (error) {
      console.log(error);
    }
  }
  req.user = { id: id, username: username };
  next();
}

module.exports = tokenAuth;
