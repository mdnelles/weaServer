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

                     /*
                     sql = `INSERT IGNORE INTO cities  (
                                    '${city}',
                                    '${city}',
                                    '${lat}',
                                    '${lng}',
                                    'Canada',
                                    'CA',
                                    'CAN',
                                    'Ottawa',
                                    '34000000',
                                    'uuid',
                                    )`;*/
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

module.exports = importcsv;
