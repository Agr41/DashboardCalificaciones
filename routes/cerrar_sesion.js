var express = require('express');
var router = express.Router();

var passport = require('passport');

router.post('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
  module.exports = router;