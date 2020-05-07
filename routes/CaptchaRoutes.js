const express = require("express"),
   captcha = express.Router(),
   cors = require("cors"),
   c = require("../config/config.json");

captcha.use(cors());

captcha.post("/get_key", (req, res) => {
   var ref = "";
   if (req.headers.referer !== undefined) {
      temp = req.headers.referer.split("/");
      ref = temp[2];
   }
   var path = __dirname;
   if (
      path.includes(c.global.acceptablePath) ||
      c.global.whitelist.includes(ref)
   ) {
      console.log("ok to return key");

      // two keys one for dev other for production
      let key = c.global.recaptcha_dev_key;
      if (!ref.includes(":3000")) key = c.global.recaptcha_pro_key;

      res.send(key);
   } else {
      // not authorized for captcha key
      res.send(0);
   }
});

module.exports = captcha;
