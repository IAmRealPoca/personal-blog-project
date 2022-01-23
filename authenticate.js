function authenticate(req, res, next) {
  let username = null;
  if (req.cookies && req.cookies.id) {
    let users = req.app.get("sessions").filter((s) => s.id === req.cookies.id);
    if (users.length) username = users[0].username;
  }
  req.username = username;
  next();
}

module.exports = authenticate;