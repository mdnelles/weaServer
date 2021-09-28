const express = require("express");
const cities = express.Router();
const cors = require("cors");
const ApiData = require("../models/ApiData"),
   ApiData16Day = require("../models/ApiDataLtd"),
   Logfn = require("../components/Logger"),
   CitiesWB = require("../models/CitiesWB"),
   jwt = require("jsonwebtoken"),
   unirest = require("unirest"),
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
   CitiesWB.findAll({
      attributes: [
         "city_id",
         "city_ascii",
         "state_name_ascii",
         "country_full",
         "lat",
         "lon",
         "population",
      ],
   })
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
         res.json({ error: "CityWBRoutes > get_cities error-> " + err });
         console.log({ error: "CityWBRoutes > get_cities error-> " + err });
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
         res.json({ error: "CityWBRoutes > get_cities error-> " + err });
         console.log({ error: "CityWBRoutes > get_cities error-> " + err });
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

cities.post("/get_data_from_rapidapi", rf.verifyRefer, (req, res) => {
   // RAPID API limit 150 per day WEATHERBIT 150/per day
   let lat = req.body.lat;
   let lon = req.body.lon;

   ApiData.findAll({ where: { lon: lon, lat: lat } })
      .then((aData) => {
         console.log("** length = " + aData.length);
         if (aData.length !== 0) {
            //let j = JSON.parse(aData.stringified);
            console.log(aData);
            res.send(aData[0].stringified);
         } else {
            console.log("API Call lat/lon = " + lat + " - " + lon);
            // api call
            var request = unirest(
               "GET",
               "https://weatherbit-v1-mashape.p.rapidapi.com/current"
            );

            request.query({
               lang: "en",
               lon,
               lat,
            });

            request.headers({
               "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
               "x-rapidapi-key": c.global.rapidApiKey,
            });

            request.end(function (response) {
               if (response.error) throw new Error(response.error);

               let tdate = response.body.data[0].ts;
               let stringified = stringify(response.body.data[0]);
               ApiData.create({
                  tdate,
                  stringified,
                  lon,
                  lat,
               })
                  .catch((err) => {
                     console.log(
                        `Err: INSERT failed CityWBRoutes.get_data_from_rapidapi: ` +
                           err
                     );
                  })
                  .then(() => {
                     res.send(stringified);
                  });
            });
         }
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
         res.json({ error: "CityWBRoutes.get_data_from_rapidapi " + err });
         console.log({ error: "CityWBRoutes.get_data_from_rapidapi" + err });
      });
});

cities.post("/get_data_from_weatherbit", rf.verifyRefer, (req, res) => {
   // RAPID API limit 150 per day WEATHERBIT 150/per day
   let lat = req.body.lat;
   let lon = req.body.lon;

   ApiData.findAll({ where: { lon: lon, lat: lat } })
      .then((aData) => {
         console.log("** length = " + aData.length);
         if (aData.length !== 0) {
            //let j = JSON.parse(aData.stringified);
            console.log(aData);
            res.send(aData[0].stringified);
         } else {
            let rest = `lat=${lat}&lon=${lon}&key=${c.global.weatherbitApiKey}`;
            // api call
            var request = unirest(
               "GET",
               "https://api.weatherbit.io/v2.0/current?" + rest
            );

            request.headers({
               "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
               "x-rapidapi-key": c.global.rapidApiKey,
            });

            request.end(function (response) {
               if (response.error) {
                  res.send("ERR: get_data_from_weatherbit: " + response.error);
                  throw new Error(response.error);
               }

               let tdate = response.body.data[0].ts;
               let stringified = stringify(response.body.data[0]);
               ApiData.create({
                  tdate,
                  stringified,
                  lon,
                  lat,
               }).catch((err) => {
                  res.send(
                     `Err: INSERT failed CityWBRoutes.get_data_from_weatherbit: ` +
                        err
                  );
                  console.log(
                     `Err: INSERT failed CityWBRoutes.get_data_from_weatherbit: ` +
                        err
                  );
               });
               res.send(stringified);
            });
         }
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
         res.json({ error: "CityWBRoutes.get_data_from_rapidapi " + err });
         console.log({ error: "CityWBRoutes.get_data_from_rapidapi" + err });
      });
});

cities.post("/get_data_live", rf.verifyRefer, (req, res) => {
   // RAPID API limit 150 per day WEATHERBIT 150/per day
   let city_id = req.body.city_id;

   CitiesWB.findOne({ where: { city_id: city_id } })
      .then((data) => {
         let lon = data.lon;
         let lat = data.lat;
         ///
         ApiData.findAll({ where: { lon: lon, lat: lat } })
            .then((aData) => {
               console.log("** length = " + aData.length);
               if (aData.length !== 0) {
                  //let j = JSON.parse(aData.stringified);

                  res.send(aData[0].stringified);
               } else {
                  let rest = `lat=${lat}&lon=${lon}&key=${c.global.weatherbitApiKey}`;
                  // api call
                  var request = unirest(
                     "GET",
                     "https://api.weatherbit.io/v2.0/current?" + rest
                  );

                  request.headers({
                     "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
                     "x-rapidapi-key": c.global.rapidApiKey,
                  });

                  request.end(function (response) {
                     if (response.error) {
                        res.send("ERR: get_data_live: " + response.error);
                        throw new Error(response.error);
                     }

                     let tdate = response.body.data[0].ts;
                     let stringified = stringify(response.body.data[0]);
                     ApiData.create({
                        tdate,
                        stringified,
                        lon,
                        lat,
                     }).catch((err) => {
                        res.send(
                           `Err: INSERT failed CityWBRoutes.get_data_live: ` +
                              err
                        );
                        console.log(
                           `Err: INSERT failed CityWBRoutes.get_data_live: ` +
                              err
                        );
                     });
                     //console.log(stringified);
                     res.send(stringified);
                  });
               }
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
               res.json({
                  error: "CityWBRoutes.get_data_from_rapidapi " + err,
               });
               console.log({
                  error: "CityWBRoutes.get_data_from_rapidapi" + err,
               });
            });
         ///
      })
      .catch((err) => {
         res.send("could not find city with id " + city_id);
         console.log("Err: CityWBRoutes.gat_data_live" + err);
      });
});

cities.post("/get_data_16", rf.verifyRefer, (req, res) => {
   // RAPID API limit 150 per day WEATHERBIT 150/per day
   let city_id = req.body.city_id;

   CitiesWB.findOne({ where: { city_id: city_id } })
      .then((data) => {
         let lon = data.lon;
         let lat = data.lat;
         ///
         ApiData16Day.findAll({ where: { lon: lon, lat: lat } })
            .then((aData) => {
               if (!!aData && aData.length !== 0) {
                  console.log(" >> No API call - found in DB");
                  //let j = JSON.parse(aData.stringified);
                  res.send(aData);
               } else {
                  console.log(">>made API Call");
                  let rest = `days=15&lat=${lat}&lon=${lon}&key=${c.global.weatherbitApiKey}`;
                  // api call
                  var request = unirest(
                     "GET",
                     "https://api.weatherbit.io/v2.0/forecast/daily?" + rest
                  );

                  request.headers({
                     "x-rapidapi-host": "weatherbit-v1-mashape.p.rapidapi.com",
                     "x-rapidapi-key": c.global.rapidApiKey,
                  });

                  request.end(function (response) {
                     if (response.error) {
                        res.send("ERR: get_data_16a: " + response.error);
                        throw new Error(response.error);
                     }

                     let tdate = response.body.data[1].ts;
                     console.log("tdate: " + tdate);
                     let stringified = stringify(response.body.data);
                     ApiData16Day.create({
                        tdate: tdate,
                        stringified: stringified,
                        lon: lon,
                        lat: lat,
                        uuid: uuid.v1(),
                     }).catch((err) => {
                        console.log(
                           `Err: INSERT failed CityWBRoutes.get_data_16b: ` +
                              err
                        );
                     });
                     res.send(stringified);
                  });
               }
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
               res.json({
                  error: "CityWBRoutes.get_data_16 " + err,
               });
               console.log({
                  error: "CityWBRoutes.get_data_16c" + err,
               });
            });
         ///
      })
      .catch((err) => {
         res.send("could not find city with id: " + city_id);
         console.log("Err: CityWBRoutes.gat_data_16: " + err);
      });
});

module.exports = cities;
