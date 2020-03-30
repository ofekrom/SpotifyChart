const express = require('express');
const app = express();
const port = 3000;
const chartController = require('./controllers/chartsManagementController');
const bodyParser = require('body-parser');

//TODO use bodyparser as a middleware express.use(bodyparser.json)

app.get('/chart', (req, res, next) => {
    chartController.getChart(req, res, next);
});
app.get('/getTTL', (req, res) => {
    chartController.getTTL(req, res);
});

app.listen(port, () => console.log(`Service is ready on port ${port}`));