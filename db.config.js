require('dotenv').config();

const pjs = require('./package.json');
const { name, version } = pjs;

var config = {
    development: {
        name,
        version,
        serviceTimeout: 30,
        postgres: {
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
        log: null

    },
    production: {
        //url to be used in link generation
        url: 'http://localhost',
        //mongodb connection settings
        database: {
            host: '127.0.0.1',
            port: '3306',
            db: 'JWTProductionDatabase'
        }
    },
};

module.exports = config;