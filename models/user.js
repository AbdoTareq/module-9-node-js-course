const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: { type: String, required: true, },
    email: { type: String, required: true, },
    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
                quantity: { type: Number, required: true, }
            }
        ]
    },
});

userSchema.methods.addToCart =
    function (product) {
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
                productId: product._id,
                quantity: newQuantity
            });
        }

        const updatedCart = { items: updatedCartItems };
        this.cart = updatedCart;
        return this.save();
    };

userSchema.methods.deleteCartItem = function (productId) {
    const updatedCartItems = this.cart.items.filter(p => {
        return p.productId.toString() !== productId.toString()
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

module.exports = mongoose.model('User', userSchema);


// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;
// const ObjectId = mongoDb.ObjectId;

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     static findById(id) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new ObjectId(id) });
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const order = {
//                 items: products,
//                 user: {
//                     _id: ObjectId(this._id),
//                     name: this.name
//                 }
//             };
//             return db.collection('orders').insertOne(order);
//         }).then(result => {
//             this.cart = { items: [] };
//             const db = getDb();
//             return db.collection('users').updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//             );
//         });
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id': ObjectId(this._id) }).toArray();
//     }

// }

// module.exports = User;