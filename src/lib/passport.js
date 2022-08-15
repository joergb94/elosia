const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const rows = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
  
  if (rows.length > 0) {
    const user = rows[0];
    
    const validPassword = await helpers.matchPass(password, user.password)
    if (validPassword) {
      done(null, user, req.flash('acceso', 'Welcome ' + user.username));
    } else {
      done(null, false, req.flash('noacceso', 'Incorrect Password'));
    }
  } else {
    return done(null, false, req.flash('noacceso', 'The Username does not exists.'));
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.idUser);
});

passport.deserializeUser(async (idUser, done) => {
  const rows = await pool.query('SELECT * FROM usuario WHERE idUser = ?', [idUser]);
  done(null, rows[0]);
});

