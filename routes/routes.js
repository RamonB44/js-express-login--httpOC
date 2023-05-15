const Auth = require("./auth/web.auth")
const Test = require("./test/web.test")
const Web = require("./web/web.routes")

module.exports = function (app) {
    Auth(app),
    Web(app)
    // comentar cuando se termine la depuracion
    // Test(app) 
}

