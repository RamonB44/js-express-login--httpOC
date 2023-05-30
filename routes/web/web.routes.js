const { authJwt, socketAuthJwt } = require("../../app/Http/middlewares/auth.middleware");
const User = require("./user/user.routes");
const Roles = require("./roles/roles.routes")
const Home = require("./home/home.routes")

module.exports = async (app) => {
    User(app),
    Roles(app)
    Home(app)
}