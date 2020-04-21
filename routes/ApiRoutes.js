const express = require("express"),
   cors = require("cors"),
   db = require("../database/db"),
   api = express.Router(),
   unirest = require("unirest"),
   axios = require("axios"),
   uuid = require("uuid"),
   c = require("../config/config.json"),
   Sequelize = require("sequelize"),
   { parse, stringify } = require("flatted/cjs");

api.use(cors());

api.get("/get/:city/:geo2", (req, res) => {
   let q = req.params.city + "%2C" + req.params.geo2;
   console.log("q = " + q);

   var reqApi = unirest("GET", c.global.apiUrl);

   reqApi.query({
      callback: "test",
      id: c.global.apiId,
      units: "%22metric%22 or %22imperial%22",
      mode: "JSON",
      q: "London%2Cuk",
   });

   reqApi.headers({
      "x-rapidapi-host": c.global.apiHost,
      "x-rapidapi-key": c.global.apiKey,
   });

   reqApi.end(function (response) {
      if (response.error) {
         res.send(response.error);
         console.log(response.error);
         //throw new Error(response.error);
      }
   });
});
api.get("/geta/:city/:geo2", (req, res) => {
   let q = req.params.city + "%2C" + req.params.geo2;

   // Make a request for a user with a giv
   axios({
      method: "GET",
      url: "https://community-open-weather-map.p.rapidapi.com/weather",
      headers: {
         "content-type": "application/octet-stream",
         "x-rapidapi-host": c.global.apiHost,
         "x-rapidapi-key": c.global.apiKey,
      },
      params: {
         callback: "test",
         id: c.global.apiId,
         units: "%22metric%22 or %22imperial%22",
         mode: "JSON",
         q: "London%2Cuk",
      },
   })
      .then((response) => {
         res.send(response);
         console.log(response);
      })
      .catch((error) => {
         res.send(error);
         console.log(error);
      });
});

api.get("/getb/:city/:geo2", (req, res) => {
   let q = req.params.city + "%2C" + req.params.geo2;

   axios({
      method: "GET",
      url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
      headers: {
         "content-type": "application/octet-stream",
         "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
         "x-rapidapi-key": "9eb7e726ebmsh421b9062a5f0fcdp1792acjsn5b07d0e7ac3f",
      },
      params: {
         lang: "en",
         lon: "-59.0947",
         lat: "-35.1849",
      },
   })
      .then((response) => {
         console.log(response);
         res.send(response);
      })
      .catch((error) => {
         console.log(error);
         res.send(error);
      });
});

api.get("/getc/:lon/:lat", (req, res) => {
   let lon = req.body.lon;
   let lat = req.body.lat;
   axios({
      method: "GET",
      url: "https://dark-sky.p.rapidapi.com/-34.1600,-58.9600",
      headers: {
         "content-type": "application/octet-stream",
         "x-rapidapi-host": "dark-sky.p.rapidapi.com",
         "x-rapidapi-key": "9eb7e726ebmsh421b9062a5f0fcdp1792acjsn5b07d0e7ac3f",
      },
      params: {
         lang: "en",
         units: "auto",
      },
   })
      .then((response) => {
         res.send(stringify(response));
         console.log(response);
      })
      .catch((error) => {
         res.send(stringify(error));
         console.log(error);
      });
});

module.exports = api;
