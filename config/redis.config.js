require('dotenv').config();

module.exports = {
    // "Redis": {}
    "User": process.env.REDIS_USERNAME,
    "Password": process.env.REDIS_PASSWORD,
    "AllowAdmin": true,
    "Ssl": false,
    "ConnectTimeout": 6000,
    "ConnectRetry": 2,
    "Database": 0,
    //"ServiceName": "my-sentinel", // In case you are using Sentinel
    "Hosts": {
        "Host": process.env.REDIS_HOST,
        "Port": process.env.REDIS_PORT,
    },
}
    // "MaxValueLength": 1024,
    // "PoolSize": 5,
    // "KeyPrefix": "wt-server",
// }