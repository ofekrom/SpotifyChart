const chartCacheManager = require('../cache/chartCacheManager');
//TODO Change date
const LATEST = "latest";
const {get} = require('lodash');
const {ApiError, ApiResponse} = require('../utils/api');
const chartDownloader = require('../services/chartDownloadService');
//TODO Check the input of type is global/regional, date is correct format, cadence is weekly/daily
//TODO add timeouts to API calls

async function download(req, res, next) {
    // TODO use constants for regional, daily, global
    const type = get(req.query, 'type', 'regional');
    const cadence = get(req.query, 'cadence', 'daily');
    const date = LATEST;
    const countryCode = get(req.query, 'countryCode', 'global');
    //TODO move to constant
    const numItems = parseInt(get(req.query, 'numItems', 200));
    const currentItem = parseInt(get(req.query, 'currentItem', 0));
    let chartResponse = await chartCacheManager.getChart(type, cadence, date, countryCode);
    if (!chartResponse) {
        try {
            chartResponse = await chartDownloader.downloadFormattedChart(type, cadence, date, countryCode);
        } catch (e) {
            // TODO prettify error
            return next(new ApiError(ApiResponse.GeneralError, e.message));
        }
        //TODO Do I need this await?
        await chartCacheManager.storeChart(type, cadence, date, countryCode, chartResponse);
    }
    try {

        const result = pagedResponse(numItems, currentItem, JSON.parse(chartResponse));
        res.send(result);
    } catch (e) {
        return next(new ApiError(ApiResponse.BadRequest, e.message));
    }
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
    return {"tracks": finalArray, "nextItemReference": nextItemReference}
}

//For testing purposes
async function getTTL(req, res) {
    const type = get(req.query, 'type', 'regional');
    const cadence = get(req.query, 'cadence', 'daily');
    const date = LATEST;
    const countryCode = get(req.query, 'countryCode', 'global');
    const retrieved = await chartCacheManager.getTTL(type, cadence, date, countryCode);
    res.send({timestamp: retrieved});
}

Object.assign(module.exports, {
    download,
    getTTL
});