var express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
require('dotenv').config({path:__dirname+'/.env'})
var router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: '/oauth2/redirect/google',
    scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
    var user = {
        id: profile.id,
        name: profile.displayName
      };
    return cb(null, user);
}));

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/'
}));

router.get('/logout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;