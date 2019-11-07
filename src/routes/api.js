var express = require('express');
var router = express.Router();
var User = require("../models/user")
let passport = require("passport")

router.get('*/:entity', require('connect-ensure-login').ensureLoggedIn(), async function (req, res, next) {
  let apiJson = {
    users: {
      get: [
        {
          id: "adsf"
        },
        {
          id: "3wefsdf"
        }
      ]
    }
  };

  res.json(apiJson[req.params.entity].get)
});

module.exports = router;
