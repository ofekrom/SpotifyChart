const moment = require('moment');
const cacheClient = require('./redisClient');
const cacheUtils = require('./cacheUtils');

function storeChart(type, cadence, date, countryCode, liveResponse, cacheStrategy) {
    const key = cacheUtils.generateCacheKeyWithParams(type, cadence, date, countryCode);
    const json = JSON.stringify(liveResponse);
    cacheClient.setAsync(key, json)
        .then(() => {
            expireKeyWithCacheStrategy(key, cacheStrategy)
        })
        .catch(err => console.log(err, ' Error while storing the cache'));
}

async function getChart(type, cadence, date, countryCode) {
    //TODO fix params to ...
    const cacheKey = cacheUtils.generateCacheKeyWithParams(type, cadence, date, countryCode);
    try {
        const jsonResult = await cacheClient.getAsync(cacheKey);
        return JSON.parse(jsonResult);
    } catch (e) {
        console.log(e, "Error while getting key from cache" + e);
    }
}

function expireKeyWithCacheStrategy(key, cacheStrategy) {
    switch (cacheStrategy) {
        case cacheUtils.cacheStrategies.HOURLY:
            return cacheClient.expireAsync(key, 3600);
        case cacheUtils.cacheStrategies.DAILY:
        default:
            let expires = moment.utc().endOf('day');
            return cacheClient.expireatAsync(key, parseInt(expires / 1000));
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