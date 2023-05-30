const jwt = require("jsonwebtoken");
const config = require("../../../../config/auth.config.js");
const db = require("../../../db.js");
const User = db.user;
const Role = db.role;

/**
 * Verifies the access token stored in the cookie.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
verifyCookieToken = async (req, res, next) => {
    try {
        // Retrieve the access token from the session
        let token = req.session.access_token;

        // Check if a token is provided
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        // Verify the access token
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY);

        // Store the user ID from the decoded token in the request object
        req.userId = decoded.id;

        // Call the next middleware function
        next();
    } catch (error) {
        // Handle the error as needed
        console.error(error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ message: "Unauthorized! Check refreshToken..." });
        }

        if(error.name === "TokenExpiredError"){
            return res.status(401).send({ message: "The token has already expired. Please refresh token..." });
        }

        return res.status(500).send({ message: "Internal Server Error" });
    }
};

/**
 * Refreshes the access token using the refresh token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
refreshToken = async (req, res, next) => {
    try {
        let refresh_token = req.session.refresh_token;

        if (!refresh_token) {
            return res.status(403).send({ message: "No refreshToken provided!" });
        }

        const decoded = jwt.verify(refresh_token, config.REFRESH_TOKEN_PRIVATE_KEY);
        const token = jwt.sign({ id: decoded.payload.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1m", // 1 minute
        });

        req.session.access_token = token; // set new session token
        next();
    } catch (error) {
        // Handle the error as needed
        console.error(error);

        if (error.name === "JsonWebTokenError") {
            return res.status(401).send({ message: "Unauthorized! Please login again..." });
        }

        if(error.name === "TokenExpiredError"){
            return res.status(401).send({ message: "The token has already expired. Please login again..." });
        }

        return res.status(500).send({ message: "Internal Server Error" });
    }
};

/**
 * Verifies the access token from the request headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.token;

        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }

        const decoded = jwt.verify(token.access_token, config.ACCESS_TOKEN_PRIVATE_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        // Handle the error as needed
        console.error(error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: "Unauthorized!" });
        }

        if(error.name === "TokenExpiredError"){
            return res.status(401).send({ message: "The token has already expired. Please refresh token..." });
        }

        return res.status(500).send({ message: "Internal Server Error" });
    }
};

/**
 * Checks if the user has admin role.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, { include: Role });
        if (user) {
            const isAdmin = user.roles.some((role) => role.roleName === "Administrador");

            if (isAdmin) {
                next();
                return;
            }
        }

        res.status(403).send({ message: "Require Admin Role!" });
    } catch (error) {
        // Handle the error as needed
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

/**
 * Checks if the user has moderator role.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId, { include: Role });

        if (user) {
            const isModerator = user.roles.some((role) => role.roleName === "Moderador");

            if (isModerator) {
                next();
                return;
            }
        }

        return res.status(403).send({ message: "Require Moderador Role!" });
    } catch (error) {
        // Handle the error as needed
        console.error(error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


const authJwt = {
    verifyCookieToken,
    refreshToken,
    verifyToken,
    isAdmin,
    isModerator,
};

module.exports = authJwt;
