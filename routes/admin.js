const express = require('express');
const { body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middlware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title').isString().trim().isLength({ min: 5 }),
    body('imageUrl', 'not valid url').isLength({ min: 5 }),
    body('price', 'invalid price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim(),
], isAuth, adminController.postAddProduct);

// /admin/edit-product => POST
router.post('/edit-product', [
    body('title').isString().trim().isLength({ min: 5 }),
    body('imageUrl', 'not valid url').isLength({ min: 5 }),
    body('price', 'invalid price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim(),
], isAuth, adminController.postEditProduct);

// /admin/edit-product => delete
router.post('/delete-product', isAuth, adminController.deleteProduct);

// /admin/edit-product => POST
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

module.exports = router;
