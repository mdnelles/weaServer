const express = require("express"),
   dbf = express.Router(),
   cors = require("cors"),
   Cities = require("../models/Cities"),
   Logfn = require("../components/Logger"),
   Sequelize = require("sequelize"),
   db = require("../database/db");
