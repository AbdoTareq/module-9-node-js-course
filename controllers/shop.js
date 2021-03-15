const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  }).catch(err => console.log(err));
};

// path is for highlighting the right tab in navigation bar
exports.getProduct = (req, res, next) => {
  const id = req.params.productId;
  // as db will return array of 1 row
  // findById beacme findByPk
  Product.findByPk(id).then(product => {
    res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' });
  }).then(err =>
    console.log(err)
  )
};

exports.getIndex = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  }).catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart().then(cart => cart.getProducts())
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    }).catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  let cart;
  let newQuantity = 1;
  req.user.getCart().then(fetchedCart => {
    cart = fetchedCart;
    return fetchedCart.getProducts({ where: { id: productId } });
  }).then(
    products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQty = product.cartItem.quantity;
        newQuantity = oldQty + 1;
        return product;
      }
      return Product.findByPk(productId);
    }
  ).then(
    prod => {
      return cart.addProduct(prod, { through: { quantity: newQuantity } })
    }
  ).then(_ => res.redirect('/cart')).catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  req.user.getCart().then(cart => {
    return cart.getProducts({ where: { id: productId } });
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  }).then(result =>
    res.redirect('/cart')
  ).catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
