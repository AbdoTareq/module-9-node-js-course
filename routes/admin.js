const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middlware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth, adminController.postAddProduct);

// /admin/edit-product => POST
router.post('/edit-product', isAuth, adminController.postEditProduct);

// /admin/edit-product => delete
router.post('/delete-product', isAuth, adminController.deleteProduct);

// /admin/edit-product => POST
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

module.exports = router;
