const API_PARAM_TYPE = 'type';
const API_PARAM_TYPE_REGIONAL = 'regional';
const API_PARAM_TYPE_VIRAL = 'viral';

const API_PARAM_CADENCE = 'cadence';
const API_PARAM_CADENCE_DAILY = 'daily';
const API_PARAM_CADENCE_WEEKLY = 'weekly';

const API_PARAM_DATE = 'date';
const API_PARAM_DATE_LATEST = 'latest';

const API_PARAM_COUNTRY_CODE = 'countryCode';
const API_PARAM_COUNTRY_CODE_GLOBAL = 'global';

const API_PARAM_NUM_ITEMS = 'numItems';
const DEFAULT_PAGINATION_NUM_ITEMS = 200;
const API_PARAM_CURRENT_ITEM = 'currentItem';
const DEFAULT_PAGINATION_CURRENT_ITEM = 0;


function buildChartURL(type, cadence, date, countryCode) {
    return `https://spotifycharts.com/${type}/${countryCode}/${cadence}/${date}/download`;
}

Object.assign(module.exports, {
    buildChartURL,
    DEFAULT_PAGINATION_NUM_ITEMS,
    DEFAULT_PAGINATION_CURRENT_ITEM,
    API_PARAM_TYPE,
    API_PARAM_TYPE_REGIONAL,
    API_PARAM_TYPE_VIRAL,
    API_PARAM_CADENCE,
    API_PARAM_CADENCE_DAILY,
    API_PARAM_CADENCE_WEEKLY,
    API_PARAM_DATE,
    API_PARAM_DATE_LATEST,
    API_PARAM_COUNTRY_CODE,
    API_PARAM_COUNTRY_CODE_GLOBAL,
    API_PARAM_NUM_ITEMS,
    API_PARAM_CURRENT_ITEM
});
