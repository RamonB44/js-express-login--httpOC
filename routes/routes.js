const Auth = require("./auth/web.auth")
const Test = require("./test/web.test")

module.exports = function (app) {
    Auth(app),
    Test(app)
}

