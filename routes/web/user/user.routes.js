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
        // Validate token for HTTP requests
        next();
    });

    /**
     * Retrieve users with an ID greater than 1.
     *
     * HTTP Method: GET
     * Endpoint: /api/users
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @handler {Function} userController.getUsers - Handler function to retrieve users.
     */
    app.get("/api/users", userController.getUsers);

    /**
     * Retrieve all users.
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
     * Create a new user record.
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
     * Update an existing user record.
     *
     * HTTP Method: PUT
     * Endpoint: /api/users/edit/:id
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.edit - Handler function to update a user.
     *
     * @param {string} id - The ID of the user to update.
     */
    app.put(
        "/api/users/edit/:id",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.edit
    );

    /**
     * Delete a user record.
     *
     * HTTP Method: DELETE
     * Endpoint: /api/users/delete/:id
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.del - Handler function to delete a user.
     *
     * @param {string} id - The ID of the user to delete.
     */
    app.delete(
        "/api/users/delete/:id",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.del
    );

    /**
     * Restore a user record.
     *
     * HTTP Method: PUT
     * Endpoint: /api/users/restore/:id
     *
     * @middleware {Function} authJwt.verifyCookieToken - Middleware to verify the cookie token.
     * @middleware {Function} authJwt.isAdmin - Middleware to check if the user is an admin.
     * @handler {Function} userController.restore - Handler function to restore a user.
     *
     * @param {string} id - The ID of the user to restore.
     */
    app.put(
        "/api/users/restore/:id",
        [authJwt.verifyCookieToken, authJwt.isAdmin],
        userController.restore
    );
}
