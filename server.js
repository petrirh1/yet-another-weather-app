require('dotenv').config();
const express = require('express'); // import statement
const fetch = require("node-fetch");
const app = express();
const api_key = process.env.API_KEY;
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening at port ${port}`));
app.use(express.static('./public'));

app.get('/weather/:param', async (request, response) => {
    const param = request.params.param.split(',');
    const lat = param[0];
    const lon = param[1];
    const lang = param[2];
    const unit = param[3];
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=${lang}&units=${unit}&APPID=${api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});

app.get('/forecast/:param', async (request, response) => {
    const param = request.params.param.split(',');
    const lat = param[0];
    const lon = param[1];
    const lang = param[2];
    const unit = param[3];
    const api_url = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&lang=${lang}&units=${unit}&APPID=${api_key}`;
    const fetch_response = await fetch(api_url);
    const json = await fetch_response.json();
    response.json(json);
});