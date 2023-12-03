const Product = require("../models/product");
const Order = require('../models/order')
const User = require('../models/user')
const fs = require ('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const rn  = require ('random-number');
const product = require("../models/product");
const stripe = require('stripe')('sk_test_51OJHzrLrQo4jZvbfMQGs4hJ5UnN464115sHf4nDyz31CPzjJUOWm0aLPWDsmpEsufpLTV1jv2YP5FdrRRo4jfdKR00mbieZND7')
const ITEMS_PER_PAGE = 3


exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1
  let totalItems

  Product.find().count().then(productNum =>{
    totalItems = productNum
    return Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)

  }).then((product) => {
    console.log("this is the products" , product)
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "Products",
        path: "/products",
         currentPage : page,
        hasNextPage : ITEMS_PER_PAGE*page < totalItems,
        hasPreviousPage : page>1,
        nextPage : page+1,
        previousPage : page-1,
        lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE)

    
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
  const page = +req.query.page || 1
  let totalItems

  Product.find().count().then(productNum =>{
    totalItems = productNum
    return Product.find()
    .skip((page-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)

  }).then((product) => {
    console.log("this is the products" , product)
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
         currentPage : page,
        hasNextPage : ITEMS_PER_PAGE*page < totalItems,
        hasPreviousPage : page>1,
        nextPage : page+1,
        previousPage : page-1,
        lastPage : Math.ceil(totalItems / ITEMS_PER_PAGE)

    
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
      console.log('get cart mai products hain ', product.cart.productId)
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
exports.getCheckoutSuccess = (req, res, next) => {
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
    console.log('order wali product ' , product.cart.items)

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
    console.log('yeh saved order', result)
    return req.user.clearCart()
  }).then(()=>{
    res.redirect('/orders')
  }).catch((err) => {
    const error = new Error (err)
    error.httpStatusCode = 500
    return next(error)
  });
}



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
    console.log('order wali product ' , product.cart.items)

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
    console.log('yeh saved order', result)
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
  const random = rn()
  const invoiceName = 'Invoice' + Math.random(random) + '.pdf'
  // console.log(invoiceName)
  const invoicePath = path.join('data' , 'invoices' , invoiceName)

  Order.findById(orderId).then((order)=>{
    if(!order){
      return next(new Error('Order isnt found'))
    }
    if(order.user.userId.toString() !== req.user._id.toString())
    {
      return next (new Error('Unauthorized'))
    }
    const fileStream  = fs.createWriteStream(invoicePath)
    const pdfkit = new PDFDocument()
    res.setHeader('Content-Type' , 'application/pdf')
    res.setHeader('Content-Disposition' , 'inline ; filename = "'+ invoiceName + '"')
    pdfkit.pipe(fileStream)
    pdfkit.fontSize(26).text('Invoice', {
      underline : true
    })
    pdfkit.fontSize(14).text('----------------------------------------------------------------------')
    let total_price = 0
    order.Products.forEach(prod =>{
      total_price = total_price + prod.quantity * prod.product.price
        pdfkit.fontSize(14).text(prod.product.title + ' - ' + prod.quantity + ' x ' + prod.product.price + '$')
    })
    pdfkit.text('-------------------------------------------------')
    pdfkit.fontSize(18).text('Total Price $ : '+ total_price )
    pdfkit.pipe(res)
    pdfkit.end()
    
  }).catch((err)=>{
    return next(err)
  })
  
  
}

exports.getCheckout = (req, res , next) =>{
  let products
  let totalAmount = 0
  req.user.populate('cart.items.productId')
  .then((product) => {
     products = product.cart.items
    console.log('checkout mai products', product)
   product.cart.items.forEach((product)=>{
    totalAmount += product.quantity*product.productId.price

   })
   res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    products: products,
    total : totalAmount,
    sessionId : session.id
  });
  
  //  return stripe.checkout.sessions.create({
  //   payment_method_types : ['card'],
  //   line_items : products.map(p=>{
  //     return {
  //       // name : p.productId.title,
  //       description : p.productId.description,
  //       price: p.productId.stripePriceId,
  //       // currency : 'usd',
  //       quantity : p.quantity
  //     }
  //   }),
  //   success_url : req.protocol + '://' + req.get('host') + '/checkout/success' , //=> http://localhost:3000/checkout/success - it will loll like this
  //   cancel_url :  req.protocol + '://' + req.get('host') + '/checkout/cancel'

  //  });

  })
  // .then((session)=>{
  //   res.render('shop/checkout', {
  //     path: '/checkout',
  //     pageTitle: 'Checkout',
  //     products: products,
  //     total : totalAmount,
  //     sessionId : session.id
  //   });
  // })
  .catch((err) => {
    console.log('getCart error:', err);
    // Pass the error to the next middleware
    next(err);
  });

}