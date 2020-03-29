function buildChartURL(type, cadence, date, countryCode) {
    return `https://spotifycharts.com/${type}/${countryCode}/${cadence}/${date}/download`;
}

Object.assign(module.exports, {
    buildChartURL
});
