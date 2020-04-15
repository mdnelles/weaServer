const express = require('express'),
   utils = express.Router(),
   cors = require('cors'),
   Sequelize = require('sequelize'),
   fs = require('fs-extra'),
   Cities = require('../models/Cities'),
   db = require('../database/db'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

utils.use(cors());

function write2File(filePath, contents) {
   return new Promise((resolve, reject) => {
      fs.writeFile(filePath, contents);
   });
}

async function asyncCall(filePath, contents, res) {
   console.log(`calling`);
   var result = await write2File(filePath, contents);
   console.log(result);
   res.send(result);
}

utils.post('/gen_json', rf.verifyToken, (req, res) => {
   // display path of file
   console.log('inside gen_json');
   Cities.findAll({ limit: 2 })
      .then((cities) => {
         //console.log(cities);
         //res.send(cities);
         let filePath = '../xxxxxxxxxxxxx.json'; //client/public/share/cities.json';
         asyncCall(filePath, cities, res);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'could not get cities',
            'catch err',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: 'CityRoutes > get_cities error-> ' + err });
         console.log({ error: 'CityRoutes > get_cities error-> ' + err });
      });
});

module.exports = utils;
