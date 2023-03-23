const { Model } = require('sequelize');

class Role extends Model { }

module.exports = (sequelize, Sequelize) => {
    Role.init({
        roleName: {
            type: Sequelize.STRING
        }
    }, { sequelize, paranoid: true, modelName: 'role' });
    return Role;
};