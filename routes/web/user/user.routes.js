const userController = require("../../../app/Http/controllers/user/user.controller");
const { authJwt, socketAuthJwt } = require("../../../app/Http/middlewares/auth.middleware");

module.exports = async function (app) {
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // validad token http
        next();
    });

    app.get("/api/user/all", userController.getUsers);

    app.get("/api/user/list", userController.list);

    app.get('/api/user/create', [authJwt.verifyToken, authJwt.isAdmin], userController.create);

    app.get('/api/user/edit', [authJwt.verifyToken, authJwt.isAdmin], userController.edit);

    app.get('/api/user/delete', [authJwt.verifyToken, authJwt.isAdmin], userController.del);

}