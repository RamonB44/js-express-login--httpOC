const jwt = require("jsonwebtoken");
const config = require("../../../../config/auth.config.js");

checkToken = async (token) => {
    if (!token) {
        console.log("auth", { message: "Invalid token" })
    }

    jwt.verify(token, config.REFRESH_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            err.data = { content: "Please retry later" };
            console.log("auth", { message: "UnAuthorized" })
        } else {
            console.log(JSON.stringify(decoded));
            console.log("auth", { message: "Authorized", user_id: decoded.id })
        }

    });
}

refreshToken = async (socket, next) => {
    const token = socket.handshake.auth.token;

};

addToBlacklist = async (socket, next) => {
    const token = socket.handshake.auth.token;

};

const socketAuthJwt = {
    checkToken
};
module.exports = socketAuthJwt;