const { authJwt, socketAuthJwt } = require("../../app/Http/middlewares/auth.middleware");
const controller = require("../../test/test.controller");

/**
 * Registers the test routes.
 *
 * @param {Object} app - The Express app object.
 */
module.exports = function (app) {
  const io = app.get("socketio");

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    await socketAuthJwt.checkToken(token);
    next();
  });

  app.use(function (req, res, next) {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    // Allow headers for CORS

    // Validate token for HTTP requests

    next();
  });

  /**
   * @route GET /api/test/all
   * @description Get public content
   */
  app.get("/api/test/all", controller.allAccess);

  /**
   * @route GET /api/test/user
   * @description Get user content
   * @access Private (requires authentication)
   */
  app.get("/api/test/user", [authJwt.verifyCookieToken], controller.userBoard);

  /**
   * @route GET /api/test/mod
   * @description Get moderator content
   * @access Private (requires authentication and moderator role)
   */
  app.get(
    "/api/test/mod",
    [authJwt.verifyCookieToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  /**
   * @route GET /api/test/admin
   * @description Get admin content
   * @access Private (requires authentication and admin role)
   */
  app.get(
    "/api/test/admin",
    [authJwt.verifyCookieToken, authJwt.isAdmin],
    controller.adminBoard
  );

};
