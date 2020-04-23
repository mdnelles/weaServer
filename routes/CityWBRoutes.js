const express = require("express"),
   cities = express.Router(),
   cors = require("cors"),
   axios = require("axios"),
   CitiesWB = require("../models/CitiesWB"),
   ApiData = require("../models/ApiData"),
   Logfn = require("../components/Logger"),
   jwt = require("jsonwebtoken"),
   uuid = require("uuid"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   { parse, stringify } = require("flatted/cjs"),
   c = require("../config/config.json"),
   rf = require("./RoutFuctions");

cities.use(cors());

let ip = "0.0.0.0"; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

cities.post("/get_cities", rf.verifyToken, (req, res) => {
   // display path of file
   CitiesWB.findAll()
      .then((cities) => {
         res.send(cities);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get cities",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "CityRoutes > get_cities error-> " + err });
         console.log({ error: "CityRoutes > get_cities error-> " + err });
      });
});

cities.post("/get_cities_by_country", rf.verifyToken, (req, res) => {
   let country = req.body.country.toString().replace(/__/g, " ");
   db.sequelize
      .query(
         "SELECT city,admin_name FROM cities WHERE country = :country ORDER BY admin_name,city ASC ",
         {
            replacements: { country: country },
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get cities",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "CityRoutes > get_cities error-> " + err });
         console.log({ error: "CityRoutes > get_cities error-> " + err });
      });
});

cities.post("/add_city", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   // jwt.verify(token, process.env.SECRET_KEY, (err) => {
   decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);

   if (
      decoded.email !== "demo" ||
      (refer !== undefined && refer.includes("http://localhost:"))
   ) {
      let uuid1 = uuid.v1();
      CitiesWB.create({
         city: req.body.data.city,
         city_ascii: req.body.data.city,
         admin_name: req.body.data.admin_name,
         country: req.body.data.country,
         population: req.body.data.population,
         lng: req.body.data.lng,
         lat: req.body.data.lat,
         iso3: req.body.data.iso3,
         id: uuid1,
      }).then(function (users) {
         res.send(uuid1);
      });
   } else {
      res.send("non persistant");
   }
});

cities.post("/edit_city", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   // jwt.verify(token, process.env.SECRET_KEY, (err) => {
   decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);

   if (
      decoded.email !== "demo" ||
      (refer !== undefined && refer.includes("http://localhost:"))
   ) {
      if (req.body.data.id !== undefined)
         CitiesWB.update(
            {
               city: req.body.data.city,
               admin_name: req.body.data.admin_name,
               country: req.body.data.country,
               population: req.body.data.population,
               lng: req.body.data.lng,
               lat: req.body.data.lat,
               iso3: req.body.data.iso3,
               id: req.body.data.id,
            },
            { where: { id: req.body.data.id } },
            { limit: 1 }
         ).then(function (users) {
            res.send("persistant addition");
         });
   } else {
      res.send("non persistant");
   }
});

cities.post("/get_api", rf.verifyRefer, (req, res) => {
   // currently not running token through middle w
   //city_id,city,province,country,token
   let city_id = req.body.city_id;
   let lat = req.body.lat;
   let lon = req.body.lon;
   ApiData.findAll({ where: { city_id: city_id } })
      .then((aData) => {
         console.log("** length = " + aData.length);
         if (aData.length !== 0) {
            let j = JSON.parse(aData.stringified);
            res.send(aData);
         } else {
            console.log(
               "need to make and API Call lat/lon = " + lat + " - " + lon
            );
            // api call
            axios({
               method: "GET",
               url: "https://weatherbit-v1-mashape.p.rapidapi.com/current",
               headers: {
                  "content-type": "application/octet-stream",
                  "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
                  "x-rapidapi-key": c.global.wb_api_key,
               },
               params: {
                  lang: "en",
                  lon: lon,
                  lat: lat,
               },
            })
               .then((response) => {
                  //console.log(response)
                  let sr = stringify(response);
                  ApiData.create({
                     city_id: city_id,
                     tdate: "12345",
                     stringified: sr,
                  });
                  res.send("1");
               })
               .catch((error) => {
                  console.log(error);
               });
         }

         //res.send(cities);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get cities",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "CityRoutes > get_cities error-> " + err });
         console.log({ error: "CityRoutes > get_cities error-> " + err });
      });
});

const apiFetch = (lon, lat) => {
   axios({
      method: "GET",
      url: "https://dark-sky.p.rapidapi.com/" + lon + "," + lat,
      headers: {
         "content-type": "application/octet-stream",
         "x-rapidapi-host": "dark-sky.p.rapidapi.com",
         "x-rapidapi-key": c.global.darkAPIKey,
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
};

module.exports = cities;