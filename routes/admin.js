const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product => POST
router.post('/edit-product', adminController.postEditProduct);

// /admin/edit-product => delete
router.post('/delete-product', adminController.deleteProduct);

// /admin/edit-product => POST
router.get('/edit-product/:productId', adminController.getEditProduct);

module.exports = router;
