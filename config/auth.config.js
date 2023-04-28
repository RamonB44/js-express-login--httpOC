require('dotenv').config();

module.exports = {
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    ACCESS_TOKEN_PRIVATE_KEY : process.env.ACCESS_TOKEN_PRIVATE_KEY,
    REFRESH_TOKEN_PRIVATE_KEY: process.env.REFRESH_TOKEN_PRIVATE_KEY
};