const { MongoClient } = require('mongodb');

const url = 'mongodb+srv://pruebas:admin@clustergeneral.l4wbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);


const dbName = 'Alumnos';

module.exports = {client, dbName}; 