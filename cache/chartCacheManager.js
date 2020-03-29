const moment = require('moment');
const cacheClient = require('./redisClient');
const cacheUtils = require('./cacheUtils');

async function storeChart(type, cadence, date, countryCode, liveResponse, cacheStrategy) {
    const key = cacheUtils.generateCacheKeyWithParams(type, cadence, date, countryCode);
    //TODO do I need these awaits?
    await cacheClient.setAsync(key, JSON.stringify(liveResponse));
    await expireKeyWithCacheStrategy(key, cacheStrategy)
}

async function getChart(type, cadence, date, countryCode) {
    //TODO fix params to ...
    return cacheClient.getAsync(cacheUtils.generateCacheKeyWithParams(type, cadence, date, countryCode))
        .catch(e => {
            console.log("Error while getting key from cache" + e)
        });
}

async function expireKeyWithCacheStrategy(key, cacheStrategy) {
    switch (cacheStrategy) {
        case cacheUtils.cacheStrategies.HOURLY:
            return cacheClient.expire(key, 3600);
        case cacheUtils.cacheStrategies.DAILY:
        default:
            let expires = moment.utc().endOf('day');
            return cacheClient.expireAtAsync(key, parseInt(expires / 1000));
    }
}

//For testing purposes
async function getTTL(type, cadence, date, countryCode) {
    return cacheClient.ttlAsync(cacheUtils.generateCacheKeyWithParams(type, cadence, date, countryCode))
        .catch(e => {
            console.log("Error while getting key from cache " + e)
        });
}

Object.assign(module.exports, {
    getChart, storeChart, getTTL
});