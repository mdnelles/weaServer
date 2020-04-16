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

utils.post("/gen_json_by_alpha", rf.verifyToken, (req, res) => {});

function doOneSpot() {
   var alpha1 = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
   ]; //alphabet array 1
   var alpha2 = alpha1; // alpa index

   alpha1.forEach((e, index) => {
      var i2 = 0;
      doTwoLetterCities(alpha1, alpha2, index, i2);
   });
}
// this is recursive
function doTwoLetterCities(alpha1, alpha2, i1, i2) {
   db.sequelize
      .query(
         " SELECT city,country FROM cities WHERE city like '" + alpha1[i1],
         alpha2[i2] + "%' ORDER BY country,city ASC ",
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then(() => {
         console.log("completed: " + alpha1[i1], alpha2[i2]);
         i2++;
         if (i2 < alpha2.length) {
            doTwoLetterCities(alpha1, alpha2, i1, i2);
         }
      })
      .catch((err) => {
         console.log("Err@ UtilRoutes.doTwoLetterCities: " + err);
      });
}

module.exports = utils;
