const express = require("express"),
   cors = require("cors"),
   db = require("../database/db"),
   api = express.Router(),
   c = require("../config/config.json"),
   Sequelize = require("sequelize"),
   ApiData = require("../models/ApiData"),
   { parse, stringify } = require("flatted/cjs");

api.use(cors());

api.get("/get_from_db", (req, res) => {
   ApiData.findAll({
      order: [["tdate", "DESC"]],
   });
});

module.exports = api;
