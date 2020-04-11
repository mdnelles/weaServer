config = require('../config/config.json');

const Sequelize = require('sequelize');
const db = {};
const sequelize = new Sequelize(
   config.global.db,
   config.global.user,
   config.global.password,
   {
      host: config.global.host,
      dialect: 'mysql',
      logging: console.log,
      freezeTableName: true,

      pool: {
         max: 5,
         min: 0,
         acquire: 30000,
         idle: 10000,
      },
   }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
