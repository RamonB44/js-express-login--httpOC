const { verifySignUp } = require("../../app/Http/middlewares/auth.middleware");
const controller = require("../../app/Http/controllers/auth.controller");

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        
        next();
    });

    app.post(
        "/api/auth/register", [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted

    ],
        controller.signup);

    app.post("/api/auth/login", controller.signin);

    app.post("/api/auth/logout", controller.signout);
    // invalida los tokens anteriores y genera uno nuevo
    app.post("/api/auth/refreshToken", controller.refreshToken);
};