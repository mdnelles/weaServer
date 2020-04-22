const express = require("express"),
   states = express.Router(),
   cors = require("cors"),
   axios = require("axios"),
   StatesWB = require("../models/StatesWB"),
   ApiData = require("../models/ApiData"),
   Logfn = require("../components/Logger"),
   jwt = require("jsonwebtoken"),
   uuid = require("uuid"),
   Sequelize = require("sequelize"),
   db = require("../database/db"),
   rf = require("./RoutFuctions");

states.use(cors());

let ip = "0.0.0.0"; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

states.post("/get_states", rf.verifyToken, (req, res) => {
   // display path of file
   StatesWB.findAll()
      .then((states) => {
         res.send(states);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get states",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "StateWBRoutes > get_states error-> " + err });
         console.log({ error: "StateWBRoutes > get_states error-> " + err });
      });
});

states.post("/get_states_by_country", rf.verifyToken, (req, res) => {
   let country = req.body.country.toString().replace(/__/g, " ");
   db.sequelize
      .query(
         "SELECT state,admin_name FROM states WHERE country = :country ORDER BY admin_name,state ASC ",
         {
            replacements: { country: country },
            type: Sequelize.QueryTypes.SELECT,
         }
      )
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get states",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "StateWBRoutes > get_states error-> " + err });
         console.log({ error: "StateWBRoutes > get_states error-> " + err });
      });
});

states.post("/add_state", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   // jwt.verify(token, process.env.SECRET_KEY, (err) => {
   decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);

   if (
      decoded.email !== "demo" ||
      (refer !== undefined && refer.includes("http://localhost:"))
   ) {
      let uuid1 = uuid.v1();
      StatesWB.create({
         state: req.body.data.state,
         state_ascii: req.body.data.state,
         admin_name: req.body.data.admin_name,
         country: req.body.data.country,
         population: req.body.data.population,
         lng: req.body.data.lng,
         lat: req.body.data.lat,
         iso3: req.body.data.iso3,
         id: uuid1,
      }).then(function (users) {
         res.send(uuid1);
      });
   } else {
      res.send("non persistant");
   }
});

states.post("/edit_state", rf.verifyToken, (req, res) => {
   let refer = req.headers.referer;
   // jwt.verify(token, process.env.SECRET_KEY, (err) => {
   decoded = jwt.verify(req.body.token, process.env.SECRET_KEY);

   if (
      decoded.email !== "demo" ||
      (refer !== undefined && refer.includes("http://localhost:"))
   ) {
      if (req.body.data.id !== undefined)
         StatesWB.update(
            {
               state: req.body.data.state,
               admin_name: req.body.data.admin_name,
               country: req.body.data.country,
               population: req.body.data.population,
               lng: req.body.data.lng,
               lat: req.body.data.lat,
               iso3: req.body.data.iso3,
               id: req.body.data.id,
            },
            { where: { id: req.body.data.id } },
            { limit: 1 }
         ).then(function (users) {
            res.send("persistant addition");
         });
   } else {
      res.send("non persistant");
   }
});

states.post("/get_api", rf.verifyToken, (req, res) => {
   let stateID = req.body.data.id;
   console.log(stateID);
   ApiData.findAll({ where: { state_id: stateID } })
      .then((aData) => {
         console.log("** length = " + aData.length);
         if (aData.length !== 0) {
            let j = JSON.parse(aData.stringified);
            res.send(aData);
         } else {
            res.send("need to make API call");
         }

         //res.send(states);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "could not get states",
            "catch err",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "StateWBRoutes > get_states error-> " + err });
         console.log({ error: "StateWBRoutes > get_states error-> " + err });
      });
});

const apiFetch = (lon, lat) => {
   axios({
      method: "GET",
      url: "https://dark-sky.p.rapidapi.com/" + lon + "," + lat,
      headers: {
         "content-type": "application/octet-stream",
         "x-rapidapi-host": "dark-sky.p.rapidapi.com",
         "x-rapidapi-key": c.global.darkAPIKey,
      },
      params: {
         lang: "en",
         units: "auto",
      },
   })
      .then((response) => {
         res.send(stringify(response));
         console.log(response);
      })
      .catch((error) => {
         res.send(stringify(error));
         console.log(error);
      });
};

module.exports = states;
