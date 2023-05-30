const homeController = require("../../../app/Http/controllers/home/home.controller");
const { authJwt } = require("../../../app/Http/middlewares/auth.middleware");

/**
 * Registers the home routes.
 *
 * @param {Object} app - The Express app object.
 */
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // Validate token for HTTP requests
        next();
    });

    app.get('/api/dashboard', [ authJwt.verifyCookieToken ], homeController.dashboard)
}