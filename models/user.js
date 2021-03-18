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

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }



    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cartProduct => {
            return cartProduct.productId.toString() == product._id.toString()
        })
        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: newQuantity
            });
        }

        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } }
        ).then(result => {
            console.log('aaaaaaaaaaa', result);
        }).catch(err => console.log(err));
    }

}

module.exports = User;