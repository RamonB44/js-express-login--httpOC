const redis = require('redis');
const config_redis = require('../config/redis.config')

const client = redis.createClient(config_redis.Hosts.Host,config_redis.Hosts.Port);

(async () => {
    await client.connect()
});

module.exports = client;