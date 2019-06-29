# yet-another-weather-app

yet-another-weather-app is a weather forecast app written in JavaScript.   
<br>
![alt tag](https://i.imgur.com/1EQIeRo.png "this is just a screenshot")
<br><br>
## running locally

You'll need a personal [OpenWeatherMap](https://openweathermap.org/api) API key.

After obtaining one, create a file called `.env` in the root of your `project’s directory.`

Inside the `.env file`, prepend `API_KEY` to `your api key` provided by OpenWeatherMap and assign it as follows:
<br/><br/>

>*API_KEY=your_api_key*

`please enter your key without quotes.`
<br/><br/><br/>

Run `npm install` to download depencies.

```
npm install
```
<br/>
Now you can run `server.js` by typing

```
node server.js
```

or by just typing `nodemon server`
```
nodemon server
```
since it's been configured so in the `package.json.`


App should be running now at `localhost:3000`
<br><br>
## icons

Icons that are used in this project are [Skycons](https://darkskyapp.github.io/skycons/).