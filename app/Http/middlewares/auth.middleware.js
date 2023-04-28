const authJwt = require("./authentication/authValidation.middleware.js");
const verifySignUp = require("./authentication/verifySignUp.middleware.js");
const socketAuthJwt = require("./authentication/socketio.middleware.js");

module.exports = {
  authJwt,
  verifySignUp,
  socketAuthJwt
};