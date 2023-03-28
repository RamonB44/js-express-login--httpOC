
require('dotenv').config();

const pjs = require('../package.json');
const { name, version } = pjs;

module.exports = {
    name,
    version,
    development: {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_DATABASE || 'JWTDatabase_MYSQL',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    "production": {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_DATABASE || 'JWTDatabase_MYSQL',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
    }
};