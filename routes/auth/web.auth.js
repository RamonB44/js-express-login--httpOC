const { verifySignUp } = require("../../app/Http/middlewares/auth.middleware");
const controller = require("../../app/Http/controllers/auth.controller");

module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // Allow headers for CORS

        next();
    });

    /**
     * @route POST /api/auth/register
     * @description User registration
     * @access Public
     * @middleware verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted
     */
    app.post(
        "/api/auth/register", [
        verifySignUp.checkDuplicateUsernameOrEmail,
        verifySignUp.checkRolesExisted

    ],
        controller.signup);

    /**
     * @route POST /api/auth/login
     * @description User login
     * @access Public
     */
    app.post("/api/auth/login", controller.signin);

    /**
     * @route POST /api/auth/logout
     * @description User logout
     * @access Public
     */
    app.post("/api/auth/logout", controller.signout);

    /**
     * @route POST /api/auth/refreshToken
     * @description Refresh access token
     * @access Public
     */
    app.post("/api/auth/refreshToken", controller.refreshToken);
};
