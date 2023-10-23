const Product = require("../models/product");
// const Cart = require("../models/cart");
const Order = require('../models/order')


exports.getProducts = (req, res, next) => {
  Product.find().then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((product) => {
    console.log("this is the products" , product)
      res.render("shop/index", {
        prods: product,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.log(err);
    })
};


exports.getCart = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .then((product)=>{
    console.log('get cart mai products hain ' , product.cart.items)
    let products = product.cart.items
    console.log('this is the another console', products)
    res.render('shop/cart' , {
      path : '/cart',
      pageTitle : 'Your Cart' ,
      products : products,
      isAuthenticated : req.session.isLoggedIn
    })
  })

}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then((product)=>{
      return req.user.addToCart(product)
  }).then((result)=>{
    res.redirect('/cart')
    console.log('post cart result', result)
  }).catch((err)=>{
    console.log('error in the post cart' , err)
  })
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
    console.log('get cart mai products hain ' , product.cart.items)
    let products = product.cart.items.map (i => {
      return { quantity : i.quantity , product : {...i.productId._doc}  }
    })
    const order = new Order({
         user : {
          name : req.user.name,
          userId : req.user
         },
         Products : products 
    })

    return order.save()
  }).then((result)=>{
    return req.user.clearCart()
  }).then(()=>{
    res.redirect('/orders')
  }).catch((err)=>{
    console.log(err)
  })
    

}
exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId' : req.user._id}).then((orders)=>{
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders : orders,
      isAuthenticated : req.session.isLoggedIn
    });
  })
};

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
