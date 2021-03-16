const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://nodejs:NREf9kfDnzVxaPX@cluster0.cw0mt.mongodb.net/test?retryWrites=true&w=majority')
        .then(client => {
            console.log('connected');
            callback(client);
        }).catch(err => console.log(err));
}

module.exports = mongoConnect;
