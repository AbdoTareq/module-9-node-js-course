const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login', [
    body('email', 'Enter valid mail').isEmail().trim().normalizeEmail(),
    body('password', 'Ente valid password').isLength({ min: 4 }).isAlphanumeric().trim(),
], authController.postLogin);

router.post('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email').trim().normalizeEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('mail exisits');
                }
            })
        }),
    body('password', 'Ente valid password').isLength({ min: 4 }).isAlphanumeric().trim(),
    body('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw Error('password has to match');
        }
        return true;
    }),

], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;