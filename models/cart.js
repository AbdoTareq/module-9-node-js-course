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
}