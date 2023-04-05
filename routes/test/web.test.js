const { authJwt } = require("../../app/Http/middlewares/auth.middleware");
const controller = require("../../test/test.controller");

module.exports = function (app) {
  const io = app.get("socketio");

  io.on("connection", (socket) => {

  });

  app.use(function (req, res, next) {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );

    next();
  });

  // /* Cuando el cliente envie una peticion al socket esta pasara por este metodo. Esto se aplica solo a las rutas en esta Hoja*/
  // io.engine.use((req, res, next) => {
  //   res.setHeader(
  //     "Access-Control-Allow-Headers",
  //     "Origin, Content-Type, Accept"
  //   );
  //   // console.log(res.body);
  //   // authJwt.verifyCookieToken(req, res, next);
  //   next();
  // });

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