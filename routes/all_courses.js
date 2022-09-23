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
      let arregloCalis = await collection.aggregate(
        [
          {
            '$match': {
              'student_id': 10
            }
          }, {
            '$project': {
              '_id': 0, 
              'class_id': 1, 
              'scores': 1,
              'promedio':{ $trunc: [ "$promedio", 1 ] }
            }
          }
        ]
      ).toArray();
      var dato = {arregloMat, arregloCalis}
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
            console.log(dato.arregloCalis)
            res.render('all_courses', { title: "Todos los cursos", student_id:req.user.student_id, materias:dato.arregloMat, calis: dato.arregloCalis});
          })  
          .catch((err)=>{
              console.log(err);
          })
          .finally(()=>{
              client.close
          })

  
});

module.exports = router;
