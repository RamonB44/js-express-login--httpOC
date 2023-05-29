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
verifyCookieToken = (req, res, next) => {
    // Retrieve the access token from the session
    let token = req.session.access_token;

    // Check if a token is provided
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    // Verify the access token
    jwt.verify(token, config.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
        // Handle verification error
        if (err) {
            return res.status(401).send({ message: "Unauthorized! Check refreshToken..." });
        }

        // Store the user ID from the decoded token in the request object
        req.userId = decoded.id;

        // Call the next middleware function
        next();
    });
};

/**
 * Refreshes the access token using the refresh token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
refreshToken = (req, res, next) => {
    let refresh_token = req.session.refresh_token;

    if (!refresh_token) {
        return res.status(403).send({ message: "No refreshToken provided!" });
    }

    jwt.verify(refresh_token, config.REFRESH_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized! Please login again..." });
        }

        const token = jwt.sign({ id: decoded.payload.id }, config.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "1m", // 1 minuto
        });

        req.session.access_token = token; // set new session token
        next();
    });
};

/**
 * Verifies the access token from the request headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
verifyToken = (req, res, next) => {
    let token = req.headers.token;

    if (!token) {
        res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token.access_token, config.ACCESS_TOKEN_PRIVATE_KEY, (err, decoded) => {
        if (err) {
            res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

/**
 * Checks if the user has admin role.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
};

/**
 * Checks if the user has moderator role.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Moderator Role!" });
                return;
            }
        );
    });
};

const authJwt = {
    verifyCookieToken,
    refreshToken,
    verifyToken,
    isAdmin,
    isModerator,
};

module.exports = authJwt;
