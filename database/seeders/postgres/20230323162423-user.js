'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let userRecord = await queryInterface.bulkInsert('users', [{
      username: 'LordHunter',
      email: 'admin@admin.com',
      password: bcrypt.hashSync('#Newgame1ramon', 8),
      createdAt: new Date(),
      updatedAt: new Date()
    }], { returning: ['id'] });
    
    return await queryInterface.bulkInsert('users_roles', [{
      userId: userRecord[0].id,
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return await queryInterface.bulkDelete('user', null, {});
  }
};
