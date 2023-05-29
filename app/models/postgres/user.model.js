const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model { }

/**
 * User Model
 *
 * Represents a user in the application.
 *
 * @param {object} sequelize - The Sequelize instance.
 * @param {object} Sequelize - The Sequelize module.
 * @returns {object} - The User model.
 */
module.exports = (sequelize, Sequelize) => {
    User.init({
        username: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING(64),
            set(value) {
                // Store the hashed password in the database
                this.setDataValue('password', bcrypt.hashSync(value, 8));
            },
        },
        token: {
            type: Sequelize.STRING(254),
        }
    }, {
        sequelize,
        paranoid: true,
        modelName: 'user'
    });

    return User;
};
