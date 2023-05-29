const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(module.filename);

require('dotenv').config();

const env_name = process.env.NODE_ENV || 'development';
const dbConfig = require("../config/config.js")[env_name];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    },
    logging: console.log,
});

const db = {};

/* Load Models */
fs
    .readdirSync(`${__dirname}\\models\\postgres\\`)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        const model = require(`${__dirname}\\models\\postgres\\${file}`)(sequelize, Sequelize);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

/* Set relationships */
db.user.belongsToMany(db.role, { through: 'users_roles' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
