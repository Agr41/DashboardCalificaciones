var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

var passport = require('passport');
var {client,dbName} = require('../db/mongo');

const Joi = require('joi');

const schema = Joi.object({

    nPassword: Joi.string()
    .min(0)
    .max(20),
    student_id: Joi.string()
   
});

passport.deserializeUser(
    async function(id, done) {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection('usuarios');
      collection.findOne({usuario:id}, function (err, user) {
        done(err, user);
  });
});
  

router.get('/',(req, res, next) => {
if (req.isAuthenticated()) {
  return next();
} else {
  res.redirect('/login')
}
}, function(req, res, next) {


      res.render('password_recovery', {  title:"Editar colono", student_id:req.user.student_id});
 
});

async function actUsu(datos){
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('usuarios');
  //var id = req.query.usuario;
  console.log(datos.student_id);

    if (datos.nPassword!=""){
      var hash = await bcrypt.hash(datos.nPassword, saltRounds);
      console.log("nueva contra"+datos.nPassword);
      console.log("usu:"+datos.student_id);
      var mistudent=parseInt(datos.student_id);
      console.log(hash)
      console.log("Se debió cambiar la contraseña");
      await collection.updateOne({student_id:mistudent},{$set:
        {
          password:hash
        }}
      );
    }

    
         
}

router.post('/editar', async function(req, res, next){
  try{
    var value = await schema.validateAsync(req.body);
    console.log(value);
  actUsu(value)
    .then(()=>{
      //AÑADIR MENSAJE DE ÉXITO DESPUÉS
      res.send(`<script>alert("Actualización exitosa")
        window.location.href='/';
        </script>`);
      res.redirect('/');
      
    })
    .catch((err)=>{
      console.log(err);
    })
    .finally(()=>{
      client.close()
    })
}
catch (err) { 
  res.redirect('/'), console.log(err); }
});


  module.exports = router;