

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

router.post('/create-order', isAuth , shopController.postOrder) 

//this route is replaced by the success checkout after inclusion of stripe in the application
 
router.post('/cart-delete-item' , isAuth ,shopController.postCartDeleteProduct)

router.get('/orders/:orderId' , isAuth , shopController.getInvoices)

router.get('/checkout', isAuth , shopController.getCheckout)




// router.get('/checkout/success' , shopController.postOrder) // here is the post order method in the checkout success


// router.get('/checkout/success' , shopController.getCheckoutSuccess)

// router.get('/checkout/cancel' , shopController.getCheckout)


router.get('/', shopController.getIndex);

module.exports = router;
