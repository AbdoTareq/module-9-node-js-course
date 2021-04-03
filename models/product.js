// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;
// class product {
//   constructor(title, price, imageUrl, description, id,userId) {
//     this.title = title;
//     this.price = price;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this._id = id ? new mongoDb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOpeeration;
//     if (this._id) {
//       // update
//       dbOpeeration = db.collection('products').updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // create
//       dbOpeeration = db.collection('products').insertOne(this);
//     }
//     return dbOpeeration.then(result => {
//       console.log(result);
//     }).catch(err => console.log(err));;
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db.collection('products').find().toArray().then(products => {
//       return products;
//     }).catch(err => console.log(err));;
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('products').find({ _id: new mongoDb.ObjectId(id) }).next().then(product => {
//       console.log(product);
//       return product;
//     }).catch(err => console.log(err));;
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db.collection('products').deleteOne({ _id: new mongoDb.ObjectId(id) }).then(result => {
//       console.log(result);
//     }).catch(err => console.log(err));;
//   }
// }

// module.exports = product;