const express = require('express');
const app = express();
const port = 3000;
const downloadChartController = require('./controllers/chartsManagementController');

app.get('/getChart', (req, res, next) => {
    downloadChartController.download(req, res, next);
});
app.get('/getTTL', (req, res) => {
    downloadChartController.getTTL(req, res);
});

app.listen(port, () => console.log(`Service is ready on port ${port}`));