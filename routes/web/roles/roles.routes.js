const rolController = require("../../../app/Http/controllers/rol/rol.controller");
const { authJwt } = require("../../../app/Http/middlewares/auth.middleware");

/**
 * Registers the roles routes.
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

    /**
     * List roles route.
     *
     * Requires authentication with a valid cookie token and moderator role.
     * Accessible through GET /api/roles/list.
     *
     * @middleware [authJwt.verifyCookieToken, authJwt.isModerator]
     */
    app.get('/api/roles/list', [authJwt.verifyCookieToken, authJwt.isModerator], rolController.list);

    /**
     * Create role route.
     *
     * Requires authentication with a valid cookie token and moderator role.
     * Accessible through POST /api/roles/create.
     *
     * @middleware [authJwt.verifyCookieToken, authJwt.isModerator]
     */
    app.post('/api/roles/create', [authJwt.verifyCookieToken, authJwt.isModerator], rolController.create);

    /**
     * Update role route.
     *
     * Requires authentication with a valid cookie token and moderator role.
     * Accessible through PUT /api/roles/update/:id.
     *
     * @middleware [authJwt.verifyCookieToken, authJwt.isModerator]
     *
     * @param {string} id - The ID of the role to update.
     */
    app.put('/api/roles/update/:id', [authJwt.verifyCookieToken, authJwt.isModerator], rolController.edit);

    /**
     * Delete role route.
     *
     * Requires authentication with a valid cookie token and moderator role.
     * Accessible through DELETE /api/roles/delete/:id.
     *
     * @middleware [authJwt.verifyCookieToken, authJwt.isModerator]
     *
     * @param {string} id - The ID of the role to delete.
     */
    app.delete('/api/roles/delete/:id', [authJwt.verifyCookieToken, authJwt.isModerator], rolController.del);

    /**
     * Restore role route.
     *
     * Requires authentication with a valid cookie token and moderator role.
     * Accessible through PUT /api/roles/restore/:id.
     *
     * @middleware [authJwt.verifyCookieToken, authJwt.isModerator]
     *
     * @param {string} id - The ID of the role to restore.
     */
    app.put('/api/roles/restore/:id', [authJwt.verifyCookieToken, authJwt.isModerator], rolController.restore);
}
