const express = require('express'),
   countries = express.Router(),
   cors = require('cors'),
   Countries = require('../models/Country'),
   Sequelize = require('sequelize'),
   db = require('../database/db'),
   Logfn = require('../components/Logger'),
   rf = require('./RoutFuctions');
//const CircularJSON = require('flatted');

countries.use(cors());

let ip = '0.0.0.0'; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

countries.post('/get_countries', rf.verifyToken, (req, res) => {
   // display path of file
   db.sequelize
      .query('SELECT * FROM countries ORDER BY country_name ASC', {
         type: Sequelize.QueryTypes.SELECT,
      })
      .then((countries) => {
         res.send(countries);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'could not get countries',
            'catch err',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: 'CountryRoutes > get_countries error-> ' + err });
         console.log({ error: 'CountryRoutes > get_countries error-> ' + err });
      });
});

module.exports = countries;
