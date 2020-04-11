const express = require('express'),
   cors = require('cors'),
   fs = require('fs-extra'),
   byline = require('byline'),
   db = require('../database/db'),
   importcsv = express.Router(),
   rf = require('./RoutFuctions'),
   Sequelize = require('sequelize');
//const CircularJSON = require('flatted');

importcsv.use(cors());

//importcsv.post('/csv', rf.verifyToken, (req, res) => {
importcsv.get('/csv', (req, res) => {
   ////////

   ////////
   function processFile() {
      return new Promise((resolve) => {
         let first = true;
         var sql, sqls;
         var stream = byline(
            fs.createReadStream('../_files/worldcitiesFull.csv', {
               encoding: 'utf8',
            })
         );

         stream
            .on('data', function (line, err) {
               if (line !== undefined) {
                  sql = 'INSERT INTO cities VALUES (' + line.toString() + ');';
                  if (first) console.log(sql);
                  first = false;
                  db.sequelize.query(sql);
               }
            })
            .on('finish', () => {
               resolve(sqls);
            });
      });
   }

   async function startStream() {
      console.log('started stream');
      const sqls = await processFile();
      res.end();
      console.log('ALL DONE');
   }

   startStream();
});

module.exports = importcsv;
`