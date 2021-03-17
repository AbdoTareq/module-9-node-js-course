const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;
const ObjectId = mongoDb.ObjectId;

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectId(id) });
    }

    addToCart(product) {
        const updatedCart = { items: [{ productId: new ObjectId(product._id), quantity: 1 }] };
        const db = getDb();
        return db.collection('users').updateOne(

            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        ).then(result => {
            console.log(result);
        }).catch(err => console.log(err));;
    }

}

module.exports = User;