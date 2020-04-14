const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
   'citie',
   {
      city: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      city_ascii: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      lat: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      lng: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      country: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      iso2: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      iso3: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      admin_name: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      capital: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      population: {
         type: Sequelize.STRING,
         defaultValue: 'na',
         allowNull: false,
      },
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
