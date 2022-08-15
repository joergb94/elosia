const express = require('express');
const router = express.Router();

const passport = require('passport');
const helpers = require('../lib/helpers');
const {isNotLoggedIn, isLoggedIn} = require('../lib/auth');
// LOGIN
router.get('/signin', isNotLoggedIn,  (req, res) => {
  console.log(req)
  res.render('login/signin');
});

// SINGIN
router.post('/signin', isNotLoggedIn,  (req, res, next) => {
  
  passport.authenticate('local.signin', {
    successRedirect: '/corteCaja',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/home',isLoggedIn, (req, res) => {
  res.render('login/home');
});
router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

module.exports = router;
