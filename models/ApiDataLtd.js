const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "api_data_16days",
   {
      lat: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false,
      },
      lon: {
         type: Sequelize.STRING,
         primaryKey: true,
         allowNull: false,
      },
      tdate: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      stringified: {
         type: Sequelize.STRING,
         allowNull: true,
      },
      uuid: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
   },
   {
      timestamps: false,
   }
);
