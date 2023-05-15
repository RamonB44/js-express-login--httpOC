const fs = require('fs');
const path = require('path');
// const buyan = require('buyan');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(module.filename);

require('dotenv').config();

const env_name = process.env.NODE_ENV || 'development';
//Load the configuration from the config.js
const dbConfig = require("../config/config.js")[env_name]; // ${__dirname}

// const log = config.log();

//const getLogger = (serviceName, serviceVersion, level) => buyan.createLogger({ name: `${serviceName}:${serviceVersion}:${level}` });

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
    logging: console.log,                  // Default, displays the first parameter of the log function call
    logging: (...msg) => console.log(msg), // Displays all log function call parameters
    logging: false,                        // Disables logging
    //logging: msg => console.log(msg),     // Use custom logger (e.g. Winston or Bunyan), displays the first parameter
    //logging: console.log(logger)     // Alternative way to use custom logger, displays all messages
});

// dbPath.log = () => getLogger(dbPath.name , dbPath.version , 'debug');
// dbPath.options.logging = msg => getLogger(dbPath.name , dbPath.version , 'debug').info(msg);
const db = {};

/* Load Models */
fs
    .readdirSync(`${__dirname}\\models\\postgres\\`)
    .filter(file =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach(file => {
        // console.log(file)
        const model = require(`${__dirname}\\models\\postgres\\${file}`)(sequelize, Sequelize);
        // console.log(model);
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    // console.log(modelName);
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
/* Set relationships */
//db['user'].belongsTo(db['role'], { as: 'role' });
db.user.belongsToMany(db.role, { through: 'users_roles' });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;