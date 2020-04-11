const express = require('express'),
   logs = express.Router(),
   cors = require('cors'),
   db = require('../database/db'),
   Sequelize = require('sequelize'),
   Log = require('../models/Logs');
(Logfn = require('../components/Logger')), (rf = require('./RoutFuctions'));

logs.use(cors());

let ip = '0.0.0.0';
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

logs.post('/get_logs', rf.verifyToken, (req, res) => {
   let code = '500',
      perPage = 20,
      offset = 0;
   let p = req.body.page;
   if (req.body.code !== undefined) code = req.body.code;
   if (req.body.perPage !== undefined) perPage = req.body.perPage;
   console.log('perPage = ' + perPage);
   console.log('p = ' + p);
   if (p !== undefined && !isNaN(p)) offset = p * perPage - perPage;

   // old query before using material ui
   // 'SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC limit :perPage OFFSET :offset',
   db.sequelize
      .query(
         'SELECT * FROM logs WHERE code LIKE :code ORDER BY id DESC LIMIT 9500',
         {
            replacements: {
               code: `%${code}%`,
               perPage: perPage,
               offset: offset,
            },
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_logs',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('Client Error @ UserFunctions > get_logs' + err);
         res.status(404).send('Error Location 102').end();
      });
});

logs.post('/get_logcount', rf.verifyToken, (req, res) => {
   let code = 500;
   if (req.body.code !== undefined) code = req.body.code;

   db.sequelize
      .query('SELECT count(*) FROM logs WHERE code = :code ', {
         replacements: {
            code: code,
         },
         type: Sequelize.QueryTypes.SELECT,
      })
      .then((data) => {
         data = JSON.stringify(data);
         let temp1 = data.split(':');
         let temp2 = temp1[1].split('}');
         let num = temp2[0];
         res.send(num);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            'get_count (logs)',
            'catch',
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log('Server @ LogRoutes.get_count' + err);
         res.status(200).send('Error LogRoutes.get_count').end();
      });
});

module.exports = logs;
