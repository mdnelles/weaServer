const jwt = require("jsonwebtoken"),
   c = require("../config/config.json"),
   Logfn = require("../components/Logger");

const get_date = () => {
   let d = new Date();
   let month = parseInt(d.getMonth());
   month += 1;
   let tdate =
      d.getDate() +
      "-" +
      month +
      "-" +
      d.getFullYear() +
      " - " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      " " +
      d.getSeconds();
   return tdate;
};

let ip = "0.0.0.0";
let tdate = get_date();
let fileName = __filename.split(/[\\/]/).pop();

const tokenTest = (token, res, jwt, caller, next) => {
   jwt.verify(token, process.env.SECRET_KEY, (err) => {
      if (err) {
         Logfn.log2db(
            500,
            fileName,
            "Token Test",
            "bad token",
            err,
            ip,
            caller,
            tdate
         );
         console.log(
            " XXXX " +
               caller +
               " failed -> token not verified: " +
               err +
               "\n==token=>" +
               token
         );
         // this will send forbidden 403 response
         res.send("not logged in");
      } else {
         Logfn.log2db(
            200,
            fileName,
            "Token Test",
            "Token accepted",
            "",
            ip,
            caller,
            tdate
         );
         console.log("token ok caller -> " + caller);
         next(); // Next middleware
      }
   });
};

exports.verifyToken = function (req, res, next) {
   if (req.body.token !== undefined) {
      var caller = "";
      if (req.body.caller !== undefined) caller = req.body.caller;
      tokenTest(req.body.token, res, jwt, caller, next);
   } else {
      // attempt to extract xhr authorization from header as last resort

      if (req.headers.token !== undefined) {
         var token = req.headers.token;
         var caller = "";
         if (req.headers.caller !== undefined) caller = req.headers.caller;
         tokenTest(req.headers.token, res, jwt, caller, next);
      } else {
         console.log(
            "fail -> token == undefined | caller-> " +
               req.body.caller +
               " | token=" +
               req.body.token
         );
         res.sendStatus(403);
      }
   }
};

// the purpose of the middleware is to ensure that the
// request being made is if with token and if not
// is from an accepted source this is the gatekeep for
// the API info.

exports.verifyRefer = function (req, res, next) {
   console.log("in verifyRefer");
   if (req.headers.referer !== undefined) {
      let t = req.headers.referer.toString().split("/");
      let r = t[2];
      console.log("r = " + r);
      if (c.global.whitelist.includes(r)) {
         next();
      } else {
         res.send(403);
      }
   } else {
      res.send(403); // access denied bad referrer
   }
};
