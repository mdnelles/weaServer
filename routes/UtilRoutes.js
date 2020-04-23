const express = require("express"),
   utils = express.Router(),
   cors = require("cors"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   c = require("../config/config.json"),
   fs = require("fs-extra"),
   Cities = require("../models/Cities"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

utils.use(cors());

const alpha = [
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

utils.post("/gen_json", rf.verifyToken, (req, res) => {
   db.sequelize
      .query(
         "SELECT city_ascii,admin_name,country FROM cities ORDER BY city ASC ",
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((cities) => {
         let file,
            r = req.headers.referer + "-".toString();

         // establish file path based on weather or not it is production or dev
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

utils.post("/gen_json_by_alpha", rf.verifyToken, (req, res) => {
   // STEP 1
   let refer = req.headers.referer + "-".toString();
   let finalResponse = initSteps(refer);
   console.log("final Respnse returned: " + finalResponse);
   res.send("ok");
});

////////////////////////////////////////////// js functions (no server calls)
// STEP 2
const initSteps = async function (refer) {
   alpha.forEach((e, index) => {
      var i2 = 0;
      let t = doTwoLetterCities(alpha, index, i2, refer);
      //let temp = await slowFunction();
   });
   return 1;
};

// Step 3 this is recursive
const doTwoLetterCities = function (alpha, i1, i2, refer) {
   db.sequelize
      .query(
         `SELECT c.city_id id, 
         c.city_ascii ci,
         s.state_name_ascii ps, 
         c.country_code co
  FROM wb_cities AS c JOIN wb_states AS s 
  ON s.state_code=c.state_code AND s.country_code = c.country_code
  WHERE c.city_ascii like  '${alpha[i1]}${alpha[i2]}%' 
  ORDER BY co, ps, ci`,
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         // need to remove accents from letters

         if (data !== undefined || data.length > 0) {
            /*
            data.forEach((e, i) => {
               if (data[i].c !== undefined) {
                  data[i].c = data[i].c
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "");
               }
               if (data[i].p !== undefined) {
                  data[i].p = data[i].p
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "");
               }
               if (data[i].o !== undefined) {
                  data[i].o = data[i].o
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "");
               }
            });*/
            let path,
               fileName = alpha[i1] + alpha[i2] + ".json";

            // establish file path based on weather or not it is production or build
            refer.includes("localhost:")
               ? (path = "../client/public/share/")
               : (path = "../client/build/share/");
            fs.outputJson(path + fileName, data).then((res) => {
               //console.log("completed: " + fileName);
               i2++;
               if (i2 < alpha.length) {
                  doTwoLetterCities(alpha, i1, i2, refer);
               }
            });
         }
      })
      .catch((err) => {
         console.log("Err@ UtilRoutes.doTwoLetterCities: " + err);
         Logfn.log2db(
            500,
            fileName,
            "UtilRoutes.doTwoLetterCities",
            "catch",
            err,
            ip,
            refer,
            tdate
         );
      });
};

module.exports = utils;
