const Role = require('./role.model');
const { Model } = require('sequelize');

class User extends Model { }

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
            type: Sequelize.STRING,
            validate: {
                is: /^[0-9a-f]{64}$/i
            },
            set(value) {
                // Storing passwords in plaintext in the database is terrible.
                // Hashing the value with an appropriate cryptographic hash function is better.
                this.setDataValue('password', hash(value));
            }
        }
    }, { sequelize, paranoid: true, modelName: 'user' });

    return User;
};