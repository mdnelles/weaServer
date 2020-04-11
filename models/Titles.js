const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'title',
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      title: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false
      },
      from_date: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false
      },
      to_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false
      }
   },
   {
      timestamps: false
   }
);
