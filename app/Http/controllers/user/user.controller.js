const sequelize = require('sequelize');
const db = require("../../../db.js");
const Op = sequelize.Op;
const User = db.user;

async function getUsers(req, res) {
    User.findAll({
        where: {
            id: {
                [Op.gt]: 1
            },
        },
        attributes: { exclude: ['password', 'token', 'updatedAt', 'deletedAt'] }
    })
        .then(users => {
            return res.status(200).send(users);// Log the retrieved data
            // Handle the data as needed
        })
        .catch(error => {
            console.error(error); // Log any errors
            // Handle the error as needed
            return res.status(500).send(error);
        });
}

module.exports = {
    getUsers
}