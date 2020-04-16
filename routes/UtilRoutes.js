const express = require("express"),
   utils = express.Router(),
   cors = require("cors"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   fs = require("fs-extra"),
   Cities = require("../models/Cities"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

utils.use(cors());

utils.post("/gen_json", rf.verifyToken, (req, res) => {
   db.sequelize
      .query("SELECT city,country FROM cities ORDER BY city ASC ", {
         type: Sequelize.QueryTypes.SELECT,
      })
      .then((cities) => {
         let file,
            r = req.headers.referer + "-".toString();

         // establish file path based on weather or not it is production or build
         r.includes("localhost:")
            ? (file = "../client/public/share/cities.json")
            : (file = "../client/build/share/cities.json");
         fs.outputJSON(file, cities)
            .then(() => {
               res.json({ success: "UtilRoutes.gen_json" });
            })
            .catch((err) => {
               console.error(err);
               Logfn.log2db(
                  500,
                  fileName,
                  "UtilRoutes.gen_json",
                  "catch",
                  err,
                  ip,
                  req.headers.referer,
                  tdate
               );
               res.json({ error: "UtilRoutes.gen_json error-> " + err });
            });
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

module.exports = utils;
