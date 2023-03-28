const db = require("../../../db.js");
const User = db.user;
const Role = db.role;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    // Username
    console.log(res.body);
    await User.findOne({
        where: {
            email: req.body.email
        }
    }
    ).then(function (user) {
        if (user) {
            res.status(400).send({ message: "Failed! Username is already in use!" });
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