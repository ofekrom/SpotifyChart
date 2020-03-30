const chartCacheManager = require('../cache/chartCacheManager');
const {get} = require('lodash');
const {ApiError, ApiResponse} = require('../utils/api');
const chartUtils = require('../utils/chartUtils');
const chartDownloader = require('../services/chartDownloadService');
const assert = require('assert');
//TODO Check date is correct format
//TODO add timeouts to API calls

async function getChart(req, res, next) {
    // TODO move this to the middleware
    const type = get(req.query, chartUtils.API_PARAM_TYPE, chartUtils.API_PARAM_TYPE_REGIONAL);
    const cadence = get(req.query, chartUtils.API_PARAM_CADENCE, chartUtils.API_PARAM_CADENCE_DAILY);
    const date = get(req.query, chartUtils.API_PARAM_DATE, chartUtils.API_PARAM_DATE_LATEST);
    const countryCode = get(req.query, chartUtils.API_PARAM_COUNTRY_CODE, chartUtils.API_PARAM_COUNTRY_CODE_GLOBAL);
    const numItems = parseInt(get(req.query, chartUtils.API_PARAM_NUM_ITEMS, chartUtils.DEFAULT_PAGINATION_NUM_ITEMS));
    const currentItem = parseInt(get(req.query, chartUtils.API_PARAM_CURRENT_ITEM, chartUtils.DEFAULT_PAGINATION_CURRENT_ITEM));
    validateParams(type, cadence, date, countryCode, numItems, currentItem);
    let chartResponse = await chartCacheManager.getChart(type, cadence, date, countryCode);
    if (!chartResponse) {
        try {
            chartResponse = await chartDownloader.downloadFormattedChart(type, cadence, date, countryCode);
        } catch (e) {
            // TODO prettify error
            return next(new ApiError(ApiResponse.GeneralError, e.message));
        }
        // I don't need to wait for storing in cache
        chartCacheManager.storeChart(type, cadence, date, countryCode, chartResponse);
    }
    let result;
    try {
        result = pagedResponse(numItems, currentItem, chartResponse);
    } catch (e) {
        return next(new ApiError(ApiResponse.BadRequest, e.message));
    }
    res.send(result);

}

function validateParams(type, cadence, date, countryCode, numItems, currentItem) {
    assert(type === chartUtils.API_PARAM_TYPE_REGIONAL || type === chartUtils.API_PARAM_TYPE_VIRAL, 'type is invalid');
    assert(cadence === chartUtils.API_PARAM_CADENCE_DAILY || type === chartUtils.API_PARAM_CADENCE_WEEKLY, 'cadence is invalid');
    assert(countryCode, 'country code is invalid');
    assert(Number.isInteger(numItems) && numItems > 0, 'Number of items is invalid');
    assert(Number.isInteger(currentItem) && numItems >= 0, 'Current item is invalid');
}

function pagedResponse(numItems, currentItem, chartResponse) {
    const chartLength = Object.keys(chartResponse).length;
    let nextItemReference = -1;
    if (currentItem < 0 || currentItem >= chartLength) {
        throw new Error('Bad offset');
    }
    if (numItems <= 0) {
        throw new Error('Bad num items');
    }
    if (currentItem + numItems >= chartLength) {
        numItems = chartLength - currentItem;
    } else {
        nextItemReference = currentItem + numItems + 1;
    }
    const finalArray = chartResponse.slice(currentItem, currentItem + numItems);
    return {'tracks': finalArray, 'nextItemReference': nextItemReference}
}

//For testing purposes
async function getTTL(req, res) {
    const type = get(req.query, chartUtils.API_PARAM_TYPE, chartUtils.API_PARAM_TYPE_REGIONAL);
    const cadence = get(req.query, chartUtils.API_PARAM_CADENCE, chartUtils.API_PARAM_CADENCE_DAILY);
    const date = chartUtils.API_PARAM_DATE_LATEST;
    const countryCode = get(req.query, chartUtils.API_PARAM_COUNTRY_CODE, chartUtils.API_PARAM_COUNTRY_CODE_GLOBAL);
    const retrieved = await chartCacheManager.getTTL(type, cadence, date, countryCode);
    res.send({timestamp: retrieved});
}

Object.assign(module.exports, {
    getChart,
    getTTL
});