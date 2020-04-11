const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'employee',
   {
      emp_no: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false
      },
      birth_date: {
         type: Sequelize.DATE,
         allowNull: false
      },
      first_name: {
         type: Sequelize.STRING,
         defaultValue: 'fn',
         allowNull: false
      },
      last_name: {
         type: Sequelize.STRING,
         defaultValue: 'ln',
         allowNull: false
      },
      gender: {
         type: Sequelize.STRING,
         values: ['M', 'F', 'X'],
         allowNull: false
      },
      hire_date: {
         type: Sequelize.DATE,
         defaultValue: Sequelize.NOW,
         allowNull: false
      }
   },
   {
      timestamps: false
   }
);
