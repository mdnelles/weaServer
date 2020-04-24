const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "api_datas",
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
         defaultValue: "na",
         allowNull: true,
      },
   },
   {
      timestamps: false,
   }
);
