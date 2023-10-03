const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.find().then((product) => {
      res.render("shop/product-list", {
        prods: product,
        pageTitle: "All Products",
        path: "/products",
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};


exports.getCart = (req,res,next) => {
  req.user.populate('cart.items.productId')
  .then((product)=>{
    console.log('get cart mai products hain ' , product.cart.items)
    let products = product.cart.items

    console.log('this is the another console',products)
    res.render('shop/cart' , {
      path : '/cart',
      pageTitle : 'Your Cart' ,
      products : products
    })
  })
  
  
  
  
  
  // .getCart().then((products)=>{
  //   console.log('get cart mai products hain ' , products)
  //   res.render('shop/cart' , {
  //     path : '/cart',
  //     pageTitle : 'Your Cart' ,
  //     products : products
  //   })
  // })

}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then((product)=>{
      return req.user.addToCart(product)
  }).then((result)=>{
    // res.redirect('/cart')
    console.log('post cart result', result)
  }).catch((err)=>{
    console.log('error in the post cart' , err)
  })
};

exports.postCartDeleteProduct = (req, res, next) => {

  const prodId = req.body.productId;
  console.log('im in the post cart delete product route !!')
  req.user.deleteItemFromCart(prodId).then((deleted)=>{
    console.log('it is deleted', deleted)
    res.redirect('/cart')
  })
};


exports.postOrder = (req, res , next ) => {
        req.user.addOrder().then((result)=>{
          res.redirect('/orders');
        }).catch(err =>{
          console.log(err)
        })

}
// exports.getOrders = (req, res, next) => {
//   res.render("shop/orders", {
//     path: "/orders",
//     pageTitle: "Your Orders",
//   });
// };

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
