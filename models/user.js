const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email, id) {
        this.name = name;
        this.email = email;
        this._id = id ? new mongoDb.ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongoDb.ObjectId(id) });
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('users').deleteOne({ _id: new mongoDb.ObjectId(id) }).then(result => {
            console.log(result);
        }).catch(err => console.log(err));;
    }

}
module.exports = User;