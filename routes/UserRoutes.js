const express = require("express"),
   users = express.Router(),
   cors = require("cors"),
   jwt = require("jsonwebtoken"),
   bcrypt = require("bcrypt"),
   path = require("path"),
   User = require("../models/User"),
   Logfn = require("../components/Logger"),
   rf = require("./RoutFuctions");
//const CircularJSON = require('flatted');

users.use(cors());

let ip = "0.0.0.0"; // install ip tracker
let tdate = Logfn.get_date();
let fileName = __filename.split(/[\\/]/).pop();

users.post("/login", (req, res) => {
   // display path of file
   User.findOne({
      where: {
         email: req.body.email,
      },
   })
      .then((user) => {
         //console.log('user found:');
         //console.log(user);
         if (user) {
            // user exists in database now try to match password

            if (bcrypt.compareSync(req.body.password, user.password)) {
               // successful login
               let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                  expiresIn: 18000,
               });
               console.log("token issued: " + token);
               res.json({ token: token });
            } else {
               Logfn.log2db(
                  500,
                  fileName,
                  "login password failed",
                  req.body.email,
                  err,
                  ip,
                  req.headers.referer,
                  tdate
               );
               console.log({
                  authFail: "email/password combination not found",
               });
               res.json({ authFail: "email/password combination not found" });
            }
         } else {
            Logfn.log2db(
               500,
               fileName,
               "login failed user does not exist",
               req.body.email,
               err,
               ip,
               req.headers.referer,
               tdate
            );
            res.json({ authFail: "login failed: user does not exist" });
            console.log({ authFail: "login failed: user does not exist" });
         }
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "login failed",
            "login failed",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         res.json({ error: "UserRoutes > login error-> " + err });
         console.log({ error: "UserRoutes > login error-> " + err });
      });
});

users.post("/islogged", rf.verifyToken, (req, res) => {
   res.status(200).json(true).end();
   // if false rf.verifyToken will send response -> res.status(403)
});

users.post("/getusers", rf.verifyToken, (req, res) => {
   User.findAll({
      where: {
         isDeleted: 0,
      },
   })
      .then((data) => {
         //console.log(data)
         res.send(data);
      })
      .catch((err) => {
         Logfn.log2db(
            500,
            fileName,
            "getusers",
            "catch",
            err,
            ip,
            req.headers.referer,
            tdate
         );
         console.log("Client Error @ UserFunctions > get_users" + err);
         res.status(404).send("Error Location 102").end();
      });
});

module.exports = users;
