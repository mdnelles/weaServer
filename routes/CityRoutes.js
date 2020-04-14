const express = require('express'),
   cities = express.Router(),
   cors = require('cors'),
   jwt = require('jsonwebtoken'),
   bcrypt = require('bcrypt'),
   Cities = require('../models/Cities'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

cities.use(cors());

let ip = '0.0.0.0'; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

cities.post('/get_cities', rf.verifyToken, (req, res) => {
   // display path of file
   Cities.findAll()
      .then((cities) => {
         res.send(cities);
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
         res.json({ error: 'CityRoutes > login error-> ' + err });
         console.log({ error: 'CityRoutes > login error-> ' + err });
      });
});

module.exports = cities;
