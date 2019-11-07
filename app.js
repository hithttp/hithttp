var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./src/routes/api');
var authRouter = require('./src/routes/auth');
var dashboardRouter = require('./src/routes/dashboard');
var Sequelize = require('sequelize');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt')

var app = express();
const port = 3000

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'SDJFGusdns%$RSDMdgf', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')))
app.use('/', authRouter)
app.use('/dashboard', dashboardRouter)
app.use('/api', apiRouter)
// app.use('/', function (req, res) {
//   res.send("We are comming soon...")
// })

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send(err);
});


var User = require("./src/models/user")


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  async function (username, password, cb) {
    let pwHash = await bcrypt.hash(password, 10);

    try {
      var user = await User.findOne({
        where: {
          username: username
        },
        attributes: ['id', 'username','password', 'createdAt', 'updatedAt']
      })
    } catch (err) {
      throw err
    }
    if (!user) {
      return cb(null, false);
    }else{
      let matchedPw = await bcrypt.compare(password,user.password);
      if(matchedPw){
        return cb(null, user);
      }else{
        return cb(null, false);
      }
    }

  }));
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(async function (user, cb) {
  delete user.password
  cb(null, user);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

