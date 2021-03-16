const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://nodejs:NREf9kfDnzVxaPX@cluster0.cw0mt.mongodb.net/shop?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected');
            _db = client.db();
            callback();
        }).catch(err => console.log(err));
}

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Db found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
