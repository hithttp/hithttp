var express = require('express');
var router = express.Router();
var User = require("../models/user")
let passport = require("passport")
const uuidv4 = require('uuid/v4');
var bcrypt = require('bcrypt')
/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    res.send("Successfully logged in")
  });

router.post('/register', async function (req, res, next) {
  let pwHash = await bcrypt.hash(req.body.password.toString(), 10);
  let user = await User.findOne({
    where: {
      username: req.body.username
    },
    attributes: ['id']
  })

  if (!user) {
    await User.create({
      username: req.body.username,
      password: pwHash,
      uuid: uuidv4()
    });
    res.json({
      status: 200,
      message: "User registered successfully"
    })
  } else {
    res.status(409).json({
      status: 409,
      message: "User already exists"
    })

  }
});
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.json(req.user);
  });
router.get('/logout', function (req, res, next) {
  req.logout();
  res.send('Successfully logged out');
});

module.exports = router;
