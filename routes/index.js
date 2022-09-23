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
      let fechas = await db.collection('usuarios').aggregate(
        [
          {
            '$match': {
              'student_id': 10
            }
          }, {
            '$project': {
              '_id': 0, 
              'student_id': 1, 
              'inicio': {
                '$dateToString': {
                  'format': '%d-%m-%Y', 
                  'date': '$inicio_beca'
                }
              }, 
              'fin': {
                '$dateToString': {
                  'format': '%d-%m-%Y', 
                  'date': '$fin_beca'
                }
              }
            }
          }
        ]
      ).toArray()
      console.log(fechas)
      let beca =0;
      if (promedio >=70){
        beca = 10
      }
      if (promedio >=80){
        beca =20;
      }
      if (promedio >=90){
        beca =30;
      }
      if(promedio == 100){
        beca = 40;
      }
      var dato = {arregloMat, promedio, beca, fechas}
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
            res.render('index', { title: "Menú Principal", student_id:req.user.student_id, materias:dato.arregloMat, promedio: dato.promedio[0].x, beca:dato.beca, fechas:dato.fechas[0]});
          })  
          .catch((err)=>{
              console.log(err);
          })
          .finally(()=>{
              client.close
          })

  
});

module.exports = router;
