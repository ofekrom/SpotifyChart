const chartUtils = require('../utils/chartUtils');
const axios = require('axios').default;
const csv = require('csvtojson');


async function downloadFormattedChart(type, cadence, date, countryCode) {
    const url = chartUtils.buildChartURL(type, cadence, date, countryCode);
    const response = await axios.get(url).catch(e => {
        console.log('error ' + e);
        throw new Error('Error while downloading this chart, please try searching with different parameters');
    });
    return await formatChartResponse(response.data).catch(e => {
        console.log('error ' + e);
        throw new Error('Error while parsing this chart, please try searching with different parameters');
    });
}

async function formatChartResponse(data) {
    try {
        //TODO move the text to constant
        data = data.substring(data.indexOf('Position,"Track Name",Artist,Streams,URL'));
    } catch (e) {
        throw new Error('Error with the format of this page, please try searching with different parameters');
    }
    let result;
    try {
        result = await csv({headers: ['rank', 'track', 'artist', 'count', 'url'], noheader: false, checkType: true})
            .fromString(data);
    } catch (e) {
        throw new Error('Error while parsing this chart, please try searching with different parameters');
    }
    return result;
}


Object.assign(module.exports, {
    downloadFormattedChart
});