const product = require('../models/product');
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
  req.user.getProducts({ where: { id: id } }).then(products => {
    const product = products[0];
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
  }).catch(err => console.log(err));
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  console.log('thissssssssssssssssssss ', req.user);
  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result => {
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
  const product = new Product(id, title, imageUrl, description, price);
  Product.findByPk(id).then(
    product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save()
    }
  ).then(
    result => {
      res.redirect('/admin/products');
      console.log('updated', result);
    }
  ).catch(err => console.log(err))

};

exports.deleteProduct = (req, res, next) => {
  const id = req.body.id;
  console.log('deleteeeeeeeeeeeee:', id);

  Product.findByPk(id)
    .then(
      product => product.destroy()
    ).then(
      result => {
        res.redirect('/admin/products')
      }
    ).catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user.getProducts().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  }).catch(err => console.log(err));
};
