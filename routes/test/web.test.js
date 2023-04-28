const { authJwt, socketAuthJwt } = require("../../app/Http/middlewares/auth.middleware");
const controller = require("../../test/test.controller");

module.exports = function (app) {
  const io = app.get("socketio");

  // io.engine.use(async (req, res, next) => {
  //   console.log(req.body)
  // });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    await socketAuthJwt.checkToken(token)
    next();
  });

  app.use(function (req, res, next) {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    // validad token http
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

};