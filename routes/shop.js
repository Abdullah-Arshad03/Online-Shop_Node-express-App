

const express = require('express');
const shopController = require('../controllers/shop')
const isAuth = require('../middleware/is-auth')

const router = express.Router();


router.get ('/cart' , isAuth, shopController.getCart)

router.post ('/cart' ,isAuth, shopController.postCart )

// // router.get('/checkout' ,shopController.getCheckout)

router.get ('/products/:productId' , shopController.getProduct)

router.get ('/products' , shopController.getProducts)

router.get('/orders', isAuth , shopController.getOrders)

router.post('/create-order', isAuth,shopController.postOrder)
 
router.post('/cart-delete-item' , isAuth ,shopController.postCartDeleteProduct)

router.get('/', shopController.getIndex);

module.exports = router;
