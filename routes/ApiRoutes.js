const express = require("express"),
   cors = require("cors"),
   db = require("../database/db"),
   api = express.Router(),
   c = require("../config/config.json"),
   Sequelize = require("sequelize"),
   Logfn = require("../components/Logger"),
   ApiData = require("../models/ApiData"),
   rf = require("./RoutFuctions"),
   { parse, stringify } = require("flatted/cjs");

api.use(cors());

api.post("/get_from_db", rf.verifyRefer, (req, res) => {
   db.sequelize
      .query(
         `SELECT 
      a.city_id AS cid,
      a.tdate as date,
      c.city_name AS ci,
      c.state_name_ascii AS ps,
      c.country_code AS co
     FROM weather.api_datas AS a
     LEFT JOIN wb_cities AS c ON
     a.city_id = c.city_id
     ORDER BY a.tdate ASC`
      )
      .then((data) => {
         res.json(data);
      })
      .catch((err) => {
         console.log("ERR @ ApiRoutes.get_from_db: " + err);
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
         res.send("ERR: " + err);
      });
});

api.post("/get_city_json", rf.verifyRefer, (req, res) => {
   console.log("in here get city json");
   ApiData.findOne({ where: { city_id: req.body.id } }, { limit: 1 })
      .then((data) => {
         console.log(data);
         res.json(data);
      })
      .catch((err) => {
         console.log("ERR @ ApiRoutes.get_city_json: " + err);
         Logfn.log2db(
            500,
            fileName,
            "could not get_city_json",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.send("ERR: " + err);
      });
});

module.exports = api;
