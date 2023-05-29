const sequelize = require('sequelize');
const Joi = require('joi');
const db = require("../../../db.js");
const Op = sequelize.Op;
const User = db.user;
const Role = db.role;

// Joi schema for request validation
const editCreateUserSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    roles: Joi.array().items(Joi.string()).required(),
});

const idSchema = Joi.object({
    id: Joi.number().required(),
});

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
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.gt]: 1
                },
            },
            attributes: { exclude: ['password', 'token', 'updatedAt', 'deletedAt'] }
        });

        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
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
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password', 'token', 'updatedAt', 'deletedAt'] }
        });

        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
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
    try {
        const { error } = editCreateUserSchema.validate(req.body);
        if (error) {
            // Validation failed, return the validation error
            return res.status(400).send({ message: error.details[0].message });
        }

        const { fullName, email, password, roles } = req.body;

        // Create a new user with the provided data
        const user = await User.create({
            username: fullName,
            email,
            password,
        });

        // Assign roles to the user
        const rolesToAdd = await Role.findAll({ where: { roleName: roles } });
        if (rolesToAdd.length > 0) {
            await user.addRoles(rolesToAdd);
        } else {
            res.status(400).send({ message: 'Record cannot be created. Credentials are necessary.' });
        }

        res.status(200).send({ message: 'Record created successfully!', userId: user.id });
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).send(error); // Handle the error as needed
    }
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
    try {
        const { error: bodyError, value: bodyValue } = editCreateUserSchema.validate(req.body);
        const { error: paramsError, value: paramsValue } = idSchema.validate(req.params);
        const { id } = paramsValue;
        const { fullName, email, password, roles } = bodyValue;

        if (bodyError || paramsError) {
            return res.status(400).send({ message: bodyError?.details[0].message || paramsError?.details[0].message });
        }

        await User.update({ username: fullName, email, password }, { where: { id } });

        const user = await User.findByPk(id);
        const rolesToAdd = await Role.findAll({ where: { roleName: roles } });

        if (rolesToAdd.length === 0) {
            return res.status(400).send({ message: 'Record has been updated but the credentials do not match.' });
        }

        await user.setRoles(rolesToAdd);

        return res.status(200).send({ message: 'Record updated successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
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
    try {
        const { error, value } = idSchema.validate(req.params);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const { id } = value;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).send({ message: 'Record not found!' });
        }

        await user.destroy();

        return res.status(200).send({ message: 'Record soft deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
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
    try {
        const { error, value } = idSchema.validate(req.params);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const { id } = value;

        const user = await User.findByPk(id, { paranoid: false });

        if (!user) {
            return res.status(404).send({ message: 'Record not found!' });
        }

        await user.restore();

        return res.status(200).send({ message: 'Record restored successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    getUsers,
    list,
    create,
    edit,
    del,
    restore
}