const fs = require('fs');
const path = require('path');

// a path to svae file
const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            // create cart
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                // if there is exisiting cart update the cart
                cart = JSON.parse(fileContent);
            }
            const exisitingProdIndex = cart.products.findIndex(p => p.id === id);
            const exisitingProd = cart.products[exisitingProdIndex];
            let updateProduct;
            if (exisitingProd) {
                // add exisitingProduct then just increase quantity
                updateProduct = exisitingProd;
                updateProduct.qty += 1;
                cart.products[exisitingProdIndex] = updateProduct;
            } else {
                // create new product
                updateProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updateProduct]
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        })
    }

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            // create cart
            if (!err) {
                const cart = JSON.parse(fileContent);
                // if there is exisiting cart update the cart
                const product = cart.products.find(p => p.id === id);
                cart.products = cart.products.filter(p => p.id !== id);
                cart.totalPrice -= product.qty * price;
                fs.writeFile(p, JSON.stringify(cart), err => {
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                console.log(err);
                cb(null);
            } else {
                cb(JSON.parse(fileContent));
            }
        });
    }

}