function authorize(reqHandler, requiredRole) {
  return async (req, res) => {
    //req.user including id and username
    if (req.user && req.user.id) {
      //if requiredRole exist => check role
      //else allow logged in user to proceed, regardless of their role.
      if (requiredRole) {
        if (requiredRole === req.user.role) {
          reqHandler(req, res);
          return;
        } else {
          res.render("forbidden");
          return;
        }
      }
      reqHandler(req, res);
    } else {
      res.render("forbidden");
      // res.send("You are not allowed to access");
    }
  };
}

module.exports = authorize;
