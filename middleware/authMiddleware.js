const passport = require('passport');

function Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/auth/login');
}

module.exports = Authenticated;