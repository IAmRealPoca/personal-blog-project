function auth(reqHandler) {
    return async (req, res) => {
        //req.user including id and username
        if (req.user && req.user.id) {
            reqHandler(req, res);
        } else {
            res.render("forbidden");
            // res.send("You are not allowed to access");
        }
    }
}

module.exports = auth;