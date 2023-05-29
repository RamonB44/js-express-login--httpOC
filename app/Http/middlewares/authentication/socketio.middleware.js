const jwt = require("jsonwebtoken");
const config = require("../../../../config/auth.config.js");

/**
 * Checks the validity of a token.
 *
 * @param {string} token - The token to be checked.
 */
checkToken = async (token) => {
    if (!token) {
        console.log("auth", { message: "Invalid token" });
    }

    jwt.verify(token, config.REFRESH_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            err.data = { content: "Please retry later" };
            console.log("auth", { message: "UnAuthorized" });
        } else {
            console.log(JSON.stringify(decoded));
            console.log("auth", { message: "Authorized", user_id: decoded.id });
        }
    });
};

/**
 * Refreshes a token.
 *
 * @param {Object} socket - The socket object.
 * @param {Function} next - The next middleware function.
 */
refreshToken = async (socket, next) => {
    const token = socket.handshake.auth.token;
};

/**
 * Adds a token to the blacklist.
 *
 * @param {Object} socket - The socket object.
 * @param {Function} next - The next middleware function.
 */
addToBlacklist = async (socket, next) => {
    const token = socket.handshake.auth.token;
};

const socketAuthJwt = {
    checkToken
};

module.exports = socketAuthJwt;
