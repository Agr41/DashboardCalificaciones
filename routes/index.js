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

async function detalleUsu(id){
  await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('Grades');
      let arregloMat = await collection.aggregate([{$match:{student_id:id}}]).toArray();
      let promedio = await collection.aggregate(
        [
          {
            '$match': {
              'student_id': id
            }
          }, {
            '$project': {
              '_id': 0, 
              'student_id': 1, 
              'promedio': 1
            }
          }, {
            '$group': {
              '_id': '$student_id', 
              'x': {
                '$avg': '$promedio'
              }
            }
          }
        ]
      ).toArray();
      var dato = {arregloMat, promedio}
      console.log(dato)
      return dato;
  };

/* GET home page. */
router.get('/',(req, res, next) => {
  if (req.isAuthenticated()) {
      return next();
  } else {
      res.redirect('/login')
  }
}, function(req, res, next) {

          //res.render('index', { title: "Menú Principal", student_id:req.user.student_id});
          detalleUsu(req.user.student_id)
          .then((dato)=>{
            console.log(dato.promedio)
            res.render('index', { title: "Menú Principal", student_id:req.user.student_id, materias:dato.arregloMat, promedio: dato.promedio[0].x});
          })  
          .catch((err)=>{
              console.log(err);
          })
          .finally(()=>{
              client.close
          })

  
});

module.exports = router;
