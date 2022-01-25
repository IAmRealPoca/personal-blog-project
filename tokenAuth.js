const jwt = require("jsonwebtoken");
function tokenAuth(req, res, next) {
  let id = null;
  let username = null;
  let role = null;
  if (req.cookies && req.cookies.token) {
    try {
      let user = jwt.verify(req.cookies.token, req.app.get("secretKey"));
      id = user.id;
      username = user.username;
      role = user.role;
    } catch (error) {
      console.log(error);
    }
  }
  req.user = { id: id, username: username, role: role };
  next();
}

module.exports = tokenAuth;
