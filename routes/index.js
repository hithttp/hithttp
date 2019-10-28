var express = require('express');
var router = express.Router();

router.get('*/:entity', function(req, res, next) {
  let apiJson = {
    users:{
      get:[
        {
          id:"adsf"
        },
        {
          id:"3wefsdf"
        }
      ]
    }
  };
  res.json(apiJson[req.params.entity].get)
});

module.exports = router;
