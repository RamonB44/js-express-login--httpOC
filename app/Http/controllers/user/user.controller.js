const sequelize = require('sequelize');
const db = require("../../../db.js");
const Op = sequelize.Op;
const User = db.user;

/**
 * Retrieves users who have an id greater than 1.
 *
 * HTTP Method: GET
 * Endpoint: /users
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response containing the retrieved users or an error message.
 */
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

/**
 * Retrieves all users.
 *
 * HTTP Method: GET
 * Endpoint: /users/all
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response containing the retrieved users or an error message.
 */
async function list(req, res) {
    User.findAll({
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

/**
 * Creates a new user record.
 *
 * HTTP Method: POST
 * Endpoint: /users/create
 * 
 * @param {Object} req - The request object containing the user data.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating a successful creation or an error message.
 */
async function create(req, res) {
    const user = User.build({
        username: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
    });
    await user.save();
    user.save().then(() => {
        res.status(200).send({ message: 'Record created successfully!' });
    });

}

/**
 * Updates an existing user record.
 *
 * HTTP Method: PUT
 * Endpoint: /users/edit
 * 
 * @param {Object} req - The request object containing the updated user data.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating a successful update or an error message.
 */
async function edit(req, res) {
    User.update({ username: req.body.username, email: req.body.email, password: req.body.password }, { where: { id: req.body.id } })
        .then(() => {
            res.status(200).send({ message: 'Record updated successfully!' });
        });
}

/**
 * Deletes a user record.
 *
 * HTTP Method: DELETE
 * Endpoint: /users/delete
 * 
 * @param {Object} req - The request object containing the user ID to be deleted.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating a successful deletion or an error message.
 */
async function del(req, res) {
    const user = await User.findByPk(req.body.id);
    await user.destroy();
    user.destroy().then(() => {
        res.status(200).send({ message: 'Record soft deleted successfully!' });
    });
}

/**
 * Restores a soft-deleted user record.
 *
 * HTTP Method: POST
 * Endpoint: /users/restore
 * 
 * @param {Object} req - The request object containing the user ID to be restored.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating a successful restoration or an error message.
 */
async function restore(req, res) {
    const user = await User.findByPk(req.body.id);
    await user.restore();
    user.restore().then(() => {
        res.status(200).send({ message: 'Record restored successfully!' });
    });
}

module.exports = {
    getUsers,
    list,
    create,
    edit,
    del
}