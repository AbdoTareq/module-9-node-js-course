const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;
class product {
  constructor(title, price, imageUrl, description) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    return db.collection('products').insertOne(this).then(result => {
      console.log(result);
    }).catch(err => console.log(err));;
  }
  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray().then(products => {
      return products;
    }).catch(err => console.log(err));;
  }

  static findById(id) {
    const db = getDb();
    return db.collection('products').find({ _id: mongoDb.ObjectId(id) }).next().then(product => {
      console.log(product);
      return product;
    }).catch(err => console.log(err));;
  }
}

module.exports = product;