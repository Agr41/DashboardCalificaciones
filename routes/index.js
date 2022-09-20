var express = require('express');
var router = express.Router();
var passport = require('passport');
var {client,dbName} = require('../db/mongo');

passport.deserializeUser(
  async function(id, done) {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('usuarios');
    collection.findOne({student_id:id}, function (err, user) {
      done(err, user);
});
});


/* GET home page. */
router.get('/',(req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login')
  }
}, function(req, res, next) {

          res.render('index', { title: "Menú Principal", student_id:req.user.student_id});

  
});

module.exports = router;
