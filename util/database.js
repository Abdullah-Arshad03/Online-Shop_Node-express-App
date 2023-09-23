const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb://127.0.0.1:27017/shop') 
    .then((client) => {
      console.log('Connected to MongoDB!');
      _db = client.db(''); // Specify the name of your local database here
      callback();
    })
    .catch((err) => {
      console.log('Error connecting to MongoDB:', err);
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
