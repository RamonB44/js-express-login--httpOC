const userController = require("../../../app/Http/controllers/user/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // validad token http
        next();
    });

    app.get("/api/user/all", userController.allAccess);

}