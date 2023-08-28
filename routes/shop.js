

const express = require('express');
const shopController = require('../controller/shop')
const adminData = require('./admin');

const router = express.Router();


router.get ('/cart' , shopController.getCart)

router.post ('/cart' , shopController.postCart )

router.get('/checkout' ,shopController.getCheckout)

router.get ('/products/:productId' , shopController.getProduct)

router.get ('/products' , shopController.getProducts)

router.get('/orders', shopController.getOrders)

router.get('/', shopController.getIndex);


module.exports = router;
