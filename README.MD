# yet-another-weather-app

yet-another-weather-app is a weather forecast app written in JavaScript.

![alt tag](https://i.imgur.com/1EQIeRo.png "this is just a screenshot")

## Running locally

You'll need a personal [OpenWeatherMap](https://openweathermap.org/api) API key.

After obtaining one, create a file called `.env` in the root of your `project’s directory.`

Inside the `.env file`, prepend `API_KEY` to `your api key` provided by OpenWeatherMap and assign it as follows:

__API_KEY=your_api_key__

*please enter your api key without quotes.*

Now you can run server.js by typing

```sh
node server.js
```

or by typing
```sh
nodemon server.js
```
if you're using nodemon.