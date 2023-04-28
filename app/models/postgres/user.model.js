const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
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
            type: Sequelize.STRING(64),
            set(value) {
                // Storing passwords in plaintext in the database is terrible.
                // Hashing the value with an appropriate cryptographic hash function is better.
                this.setDataValue('password', bcrypt.hashSync(value, 8));
            },
        },
        token : {
            type: Sequelize.STRING(254),
        }
    }, { sequelize, paranoid: true, modelName: 'user' });

    return User;
};