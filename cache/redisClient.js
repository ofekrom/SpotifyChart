const redis = require('redis');
const client = redis.createClient('6379', '127.0.0.1');
const {promisify} = require("util");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const ttlAsync = promisify(client.ttl).bind(client);
const expireatAsync = promisify(client.expireat).bind(client);
const expireAsync = promisify(client.expire).bind(client);


//TODO fail process if connection to Redis has failed
// Retry
// Should I handle disconnection?
client.on('connect', function () {
    console.log('connected');
});


Object.assign(module.exports, {
    getAsync, setAsync, ttlAsync, expireatAsync, expireAsync
});