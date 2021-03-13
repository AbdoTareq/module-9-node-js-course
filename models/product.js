const fs = require('fs');
const path = require('path');
const Cart = require('./cart');

// a path to svae file
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = cb => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      // if id exists then it's edit operation
      if (this.id) {
        const index = products.findIndex(p => p.id === this.id);
        products[index] = this;
      } else {
        this.id = Math.random().toString();
        products.push(this);
      }
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static delete(id) {
    getProductsFromFile(products => {
      // if id exists then it's edit operation
      if (id) {
        const index = products.findIndex(p => p.id === id);
        const product = products[index];

        if (index > -1) {
          // splice takes index and elements number to remove
          products.splice(index, 1);
        }
        fs.writeFile(p, JSON.stringify(products), err => {
          if (!err) {
            Cart.deleteProduct(id, product.price);
          } else
            console.log(err);
        });
      } else {
        console.log('id does not exist error in delete');
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      cb(product);
    });
  }
};
