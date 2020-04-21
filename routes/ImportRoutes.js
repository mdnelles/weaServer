const express = require("express"),
   cors = require("cors"),
   fs = require("fs-extra"),
   byline = require("byline"),
   db = require("../database/db"),
   importcsv = express.Router(),
   rf = require("./RoutFuctions"),
   uuid = require("uuid"),
   Sequelize = require("sequelize");
//const CircularJSON = require('flatted');

importcsv.use(cors());

//importcsv.post('/csv', rf.verifyToken, (req, res) => {
importcsv.get("/csv", (req, res) => {
   ////////

   ////////
   function processFile() {
      return new Promise((resolve) => {
         let first = true;
         var sql, sqls;
         var stream = byline(
            fs.createReadStream("../_files/worldcitiesFull.csv", {
               encoding: "utf8",
            })
         );

         stream
            .on("data", function (line, err) {
               if (line !== undefined) {
                  sql = "INSERT INTO cities VALUES (" + line.toString() + ");";
                  if (first) console.log(sql);
                  first = false;
                  db.sequelize.query(sql);
               }
            })
            .on("finish", () => {
               resolve(sqls);
            });
      });
   }

   async function startStream() {
      console.log("started stream");
      const sqls = await processFile();
      res.end();
      console.log("ALL DONE");
   }

   startStream();
});

importcsv.get("/csv2", (req, res) => {
   ////////
   function processFile2(uuid) {
      return new Promise((resolve) => {
         uuid = require("uuid");
         let five = true;
         var sql,
            sqls,
            city,
            province,
            uuid,
            lat,
            lng,
            count = 0;
         var stream = byline(
            fs.createReadStream("../_files/cancities.csv", {
               encoding: "utf8",
            })
         );

         stream
            .on("data", function (line, err) {
               if (line !== undefined) {
                  if (line !== undefined && line.length > 2) {
                     temp = line.toString().split(",");
                     city = temp[0];
                     province = temp[1];
                     lat = temp[3];
                     lng = temp[4];
                     uuid1 = uuid.v1();
                     //console.log(city + ", " + province);
                     //sql = "INSERT INTO cities VALUES (" + line.toString() + ");";
                     sql = `INSERT IGNORE INTO cities SET
                        city = '${city}',
                        city_ascii = '${city}',
                        lat = '${lat}',
                        lng = '${lng}',
                        country = 'Canada',
                        iso2 = 'CA',
                        iso3 = 'CAN',
                        admin_name = '${province}',
                        capital = 'Ottawa',
                        population = '34000000',
                        id = '${uuid1}'
                        `;

                     if (five) console.log(sql);
                     if (count > 5) {
                        five = false;
                     }
                     count++;
                     db.sequelize.query(sql);
                  }
               }
            })
            .on("finish", () => {
               resolve(sqls);
            });
      });
   }

   async function startStream2() {
      console.log("started stream");
      const sqls = await processFile2(uuid);
      res.end();
      console.log("ALL DONE");
   }

   startStream2(uuid);
});

importcsv.get("/countries_array", (req, res) => {
   db.sequelize
      .query(
         `SELECT ANY_VALUE(country) as cou,ANY_VALUE(iso2) as iso FROM cities GROUP BY country`,
         {
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         let outp = "";
         data.forEach((e, i) => {
            //outp = data[i].c}
         });
         res.send(data);
      });
});

// weather bit cities import
importcsv.get("/csv_cities_wb", (req, res) => {
   ////////

   let five = true;
   var sql,
      sqls,
      city_id,
      city,
      city_ascii,
      state_code,
      country_code,
      country_full,
      lat,
      lng,
      count = 0;
   var stream = byline(
      fs.createReadStream("../_files/cities_20000_wb.csv", {
         encoding: "utf8",
      })
   );

   stream
      .on("data", function (line, err) {
         if (line !== undefined) {
            if (line !== undefined && line.length > 2) {
               temp = line.toString().split(",");
               if (temp[1] !== undefined) {
                  city_id = temp[0];
                  city_name = temp[1];
                  city_ascii = temp[1]
                     .normalize("NFD")
                     .replace(/[\u0300-\u036f]/g, "");
                  state_code = temp[2];
                  country_code = temp[3];
                  country_full = temp[4];
                  lat = temp[5];
                  lon = temp[6];
                  //console.log(city + ", " + province);
                  //sql = "INSERT INTO cities VALUES (" + line.toString() + ");";
                  sql = `INSERT IGNORE INTO wb_cities SET
                        city_id= '${city_id}',
                        city_name = '${city_name}',
                        city_ascii = '${city_ascii}',
                        state_code = '${state_code}',
                        country_code = '${country_code}',
                        country_full = '${country_full}',
                        lat= '${lat}',
                        lon= '${lon}'
                           `;

                  if (five) console.log(sql);
                  if (count > 5) {
                     five = false;
                  }
                  count++;
                  db.sequelize.query(sql);
               }
            }
         }
      })
      .on("finish", () => {
         console.log("all done");
         res.send("ok");
      });
});

importcsv.get("/csv_states_wb", (req, res) => {
   ////////

   var sql,
      state_code,
      state_name,
      state_name_ascii,
      country_code,
      count = 0;
   var stream = byline(
      fs.createReadStream("../_files/states_wb.csv", {
         encoding: "utf8",
      })
   );

   stream
      .on("data", function (line, err) {
         if (line !== undefined && line.length > 2) {
            line = line.replace(/"/g, "");
            temp = line.toString().split(",");
            if (temp[1] !== undefined && temp[1].length > 1) {
               state_code = temp[0];
               state_name = temp[1];
               state_name_ascii = temp[1]
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "");
               country_code = temp[2];
               sql = `INSERT IGNORE INTO wb_states SET
                        id = '${count}',
                        state_code = '${state_code}',
                        state_name = '${state_name}',
                        state_name_ascii = '${state_name_ascii}',
                        country_code = '${country_code}'
                           `;
               // Error Code: 1054. Unknown column 'id' in 'field list'

               count++;
               db.sequelize.query(sql);
            }
         }
      })
      .on("finish", () => {
         console.log("all done");
         res.send("ok");
      });
});

module.exports = importcsv;
