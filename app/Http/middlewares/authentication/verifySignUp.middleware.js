const db = require("../../../db.js");
const User = db.user;
const Role = db.role;

/**
 * Checks if the username or email is already in use.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
checkDuplicateUsernameOrEmail = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function (user) {
        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!" });
            return;
        }

        next();
    }).catch(function (err) {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
    });
};

/**
 * Checks if the specified roles exist.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
            if (!Role.includes(req.body.roles[i])) {
                res.status(400).send({
                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                });
                return;
            }
        }
    }

    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};

module.exports = verifySignUp;
