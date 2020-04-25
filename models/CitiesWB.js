const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "wb_citie",
   {
      city_id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      city_name: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      city_ascii: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: false,
      },
      state_code: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      state_name_ascii: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      country_code: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      country_full: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      lat: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: false,
      },
      lon: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: false,
      },
      population: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: false,
      },
   },
   {
      timestamps: false,
   }
);
