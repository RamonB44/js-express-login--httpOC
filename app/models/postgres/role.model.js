const { Model } = require('sequelize');

class Role extends Model { }

/**
 * Role Model
 *
 * Represents a role in the application.
 *
 * @param {object} sequelize - The Sequelize instance.
 * @param {object} Sequelize - The Sequelize module.
 * @returns {object} - The Role model.
 */
module.exports = (sequelize, Sequelize) => {
    // Initialize the Role model
    Role.init({
        roleName: {
            type: Sequelize.STRING
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'role'
    });

    return Role;
};
