const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'countrie',
   {
      cc_fips: {
         type: Sequelize.STRING,
         allowNull: false,
      },
      cc_iso: {
         type: Sequelize.STRING,
         allowNull: false,
      },
      tld: {
         type: Sequelize.STRING,
         allowNull: false,
      },
      country_name: {
         type: Sequelize.STRING,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
