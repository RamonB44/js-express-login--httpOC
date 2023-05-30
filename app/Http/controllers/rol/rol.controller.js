const sequelize = require('sequelize');
const db = require("../../../db.js");
const Op = sequelize.Op;
const Role = db.role;

/**
 * Get a list of roles.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The list of roles.
 */
async function list(req, res) {
    try {
        const users = await Role.findAll({
            attributes: { exclude: ['updatedAt', 'deletedAt'] }
        });

        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

/**
 * Create a new role.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The created role.
 */
async function create(req, res) {
    try {
        const { error } = editCreateRoleSchema.validate(req.body);
        if (error) {
            // Validation failed, return the validation error
            return res.status(400).send({ message: error.details[0].message });
        }

        const { roleName } = req.body;

        // Create a new user with the provided data
        const role = await Role.create({
            roleName,
        });

        res.status(200).send({ message: 'Record created successfully!', roleId: role.id });
    } catch (error) {
        console.error(error); // Log any errors
        res.status(500).send(error); // Handle the error as needed
    }
}

/**
 * Update a role.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The updated role.
 */
async function edit(req, res) {
    try {
        const { error: bodyError, value: bodyValue } = editCreateRoleSchema.validate(req.body);
        const { error: paramsError, value: paramsValue } = idSchema.validate(req.params);
        const { id } = paramsValue;
        const { roleName } = bodyValue;

        if (bodyError || paramsError) {
            return res.status(400).send({ message: bodyError?.details[0].message || paramsError?.details[0].message });
        }

        await Role.update({ roleName }, { where: { id } });

        return res.status(200).send({ message: 'Record updated successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

/**
 * Soft delete a role.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The soft deleted role.
 */
async function del(req, res) {
    try {
        const { error, value } = idSchema.validate(req.params);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const { id } = value;

        const role = await Role.findByPk(id);

        if (!user) {
            return res.status(404).send({ message: 'Record not found!' });
        }

        await role.destroy();

        res.status(200).send({ message: 'Record soft deleted successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}


/**
 * Restore a soft deleted role.
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - The restored role.
 */
async function restore(req, res) {
    try {
        const { error, value } = idSchema.validate(req.params);

        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }

        const { id } = value;

        const role = await Role.findByPk(id, { paranoid: false });

        if (!role) {
            return res.status(404).send({ message: 'Record not found!' });
        }

        await role.restore();

        return res.status(200).send({ message: 'Record restored successfully!' });
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}

module.exports = {
    list,
    create,
    edit,
    del,
    restore,
}
