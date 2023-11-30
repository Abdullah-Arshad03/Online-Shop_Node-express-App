const Product = require("../models/product");
const Order = require('../models/order')
const fs = require ('fs')
const path = require('path')


exports.getProducts = (req, res, next) => {
  Product.find().then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch((err) => {
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products"
      });
    })
    .catch((err) => {
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((product) => {
    console.log("this is the products" , product)
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/"
    
      });
    })
    .catch((err) => {
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
    });
};


exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
    .then((product) => {
      console.log('get cart mai products hain ', product.cart.items)
      let products = product.cart.items
      console.log('this is the another console', products)
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch((err) => {
      console.log('getCart error:', err);
      // Pass the error to the next middleware
      next(err);
    });
};


exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then((product)=>{
      return req.user.addToCart(product)
  }).then((result)=>{
    res.redirect('/cart')
    console.log('post cart result', result)
  }).catch((err) => {
    console.log('post py error araha hy ',err)
    const error = new Error (err)
    error.httpStatusCode = 500
    return next(error)
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('im in the post cart delete product route !!')
  req.user.removeFromCart(prodId).then((deleted)=>{
  res.redirect('/')
  })
};


exports.postOrder = (req, res , next ) => {
  req.user.populate('cart.items.productId')
  .then((product)=>{
    console.log('get cart mai products hain ' , req.user.email)

    let products = product.cart.items.map (i => {
      return { quantity : i.quantity , product : {...i.productId._doc}  }
    })
    const order = new Order({
         user:{
          email : req.user.email,
          userId : req.user
         },
         Products : products 
    })
    return order.save()
  }).then((result)=>{
    return req.user.clearCart()
  }).then(()=>{
    res.redirect('/orders')
  }).catch((err) => {
    const error = new Error (err)
    error.httpStatusCode = 500
    return next(error)
  });
    

}
exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId' : req.user._id}).then((orders)=>{
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders : orders
    });
  })
};

exports.getInvoices = (req, res , next) =>{

  const orderId = req.params.orderId
  const invoiceName = 'Invoice.pdf'
  console.log(invoiceName)
  const invoicePath = path.join('data' , 'invoices' , invoiceName)

  fs.readFile(invoicePath , (err , data)=>{
    if(err){
      next(err)
    }
    res.setHeader('Content-Type' , 'application/pdf')
     res.setHeader('Content-Disposition' , 'attachment; filename = "' + invoiceName + '"')
     res.send(data)
  })
}

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
