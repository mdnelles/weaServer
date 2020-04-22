const Sequelize = require("sequelize");
const db = require("../database/db.js");

module.exports = db.sequelize.define(
   "wb_state",
   {
      id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         allowNull: false,
      },
      state_code: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: true,
      },
      state_name: {
         type: Sequelize.STRING,
         defaultValue: "na",
         allowNull: false,
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
   },
   {
      timestamps: false,
   }
);
