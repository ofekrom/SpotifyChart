function generateCacheKeyWithParams(type, cadence, date, countryCode) {
    return `${type}_${cadence}_${date}_${countryCode}`;
}

Object.assign(module.exports, {
    generateCacheKeyWithParams,
    'cacheStrategies': {
        DAILY: 'DAILY',
        HOURLY: 'HOURLY'
    },
});
