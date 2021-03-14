const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
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
  console.log(req.params);
  Product.findById(id, product => {
    if (!product) {
      console.log('product doesnot exist ', product);
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('addddddddddddddddddddddddddd');
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result => {
    console.log(result);
  }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  console.log('editttttttttttttttttttttttt');

  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(id, title, imageUrl, description, price);
  product.save();
  return res.redirect('/admin/products');
};

exports.deleteProduct = (req, res, next) => {
  const id = req.body.id;
  console.log('deleteeeeeeeeeeeee:', id);

  Product.delete(id);
  return res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then(([rows, fieldData]) => {
    res.render('admin/products', {
      prods: rows,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};
