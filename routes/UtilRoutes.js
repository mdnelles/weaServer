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

utils.post('/gen_json', rf.verifyToken, (req, res) => {
   Cities.findAll({ limit: 2 })
      .then((cities) => {
         let file,
            r = req.headers.referer + '-'.toString();

         // establish file path based on weather or not it is production or build
         r.includes('localhost:')
            ? (file = '../client/public/share/cities.json')
            : (file = '../client/build/share/cities.json');
         fs.outputJSON(file, cities)
            .then(() => {
               res.json({ success: 'UtilRoutes.gen_json' });
            })
            .catch((err) => {
               console.error(err);
               Logfn.log2db(
                  500,
                  fileName,
                  'UtilRoutes.gen_json',
                  'catch',
                  err,
                  ip,
                  req.headers.referer,
                  tdate
               );
               res.json({ error: 'UtilRoutes.gen_json error-> ' + err });
            });
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
