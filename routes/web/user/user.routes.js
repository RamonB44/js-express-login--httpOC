const userController = require("../../../app/Http/controllers/user/user.controller");
const { authJwt, socketAuthJwt } = require("../../../app/Http/middlewares/auth.middleware");

/**
 * Registers the user routes.
 *
 * @param {Object} app - The Express app object.
 */
module.exports = async function (app) {
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        // validate token http
        next();
    });

    /**
     * Retrieves users who have an id greater than 1.
     *
     * HTTP Method: GET
     * Endpoint: /api/users
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @handler {Function} userController.getUsers - Handler function to retrieve users.
     */
    app.get("/api/users", userController.getUsers);

    /**
     * Retrieves all users.
     *
     * HTTP Method: GET
     * Endpoint: /api/users/all
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.list - Handler function to retrieve all users.
     */
    app.get(
        "/api/users/all",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.list
    );

    /**
     * Creates a new user record.
     *
     * HTTP Method: POST
     * Endpoint: /api/users/create
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.create - Handler function to create a user.
     */
    app.post(
        "/api/users/create",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.create
    );

    /**
     * Updates an existing user record.
     *
     * HTTP Method: PUT
     * Endpoint: /api/users/edit
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.edit - Handler function to update a user.
     */
    app.put(
        "/api/users/edit",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.edit
    );

    /**
     * Deletes a user record.
     *
     * HTTP Method: DELETE
     * Endpoint: /api/users/delete
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.del - Handler function to delete a user.
     */
    app.delete(
        "/api/users/delete",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.del
    );
}
