const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log(editMode);
  if (!editMode) {
    console.log('add product not edit');
    return res.redirect('/');
  }
  const id = req.params.productId;
  Product.findById(id).then(product => {
    if (!product) {
      console.log('product doesnot exist ', product);
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: []
    });
  }).catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({ title: title, price: price, imageUrl: imageUrl, description: description, userId: req.user });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: product,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  product.save()
    .then(result => {
      console.log(result);
      res.redirect('/admin/products')
    }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  console.log('editttttttttttttttttttttttt');

  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    return res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        _id: id,
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
      },
      // for the head error message
      errorMessage: errors.array()[0].msg,
      // for border highlight error
      validationErrors: errors.array()
    });
  }

  Product.findById(id).then(product => {
    if (product.userId.toString() !== req.user._id.toString()) {
      console.log('notttttttt Allllllllllllowed');
      return res.redirect('/');
    }
    product.title = title;
    product.imageUrl = imageUrl;
    product.price = price;
    product.description = description;
    return product.save(id).then(
      result => {
        res.redirect('/admin/products');
        console.log('updated', result);
      }).catch(err => {
        console.log(err);
        res.redirect('/500');
      })
  })
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.id;
  console.log('deleteeeeeeeeeeeee:', prodId);

  Product.deleteOne({ _id: prodId, userId: req.user._id }).then(
    () => {
      res.redirect('/admin/products')
    }
  ).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',

      });
    }).catch(err => console.log(err));
};
