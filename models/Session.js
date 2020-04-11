const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'departments',
   {
      dept_no: {
         type: Sequelize.STRING,
         primaryKey: true
      },
      dept_name: {
         type: Sequelize.STRING
      }
   },
   {
      timestamps: false
   }
);
