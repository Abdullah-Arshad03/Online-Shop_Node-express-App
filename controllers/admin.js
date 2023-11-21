const Product = require("../models/product");
const mongodb = require("mongodb");
const {validationResult} = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage : '', 
    hasError : false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)


  if(!errors.isEmpty()){
        console.log('in post addproduct clicked')
       return  res.status(422).render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/add-product",
        editing: false,
        hasError : true,
        product: {
          title : title,
          imageUrl : imageUrl,
          price : price,
          description : description
        },
        errorMessage : errors.array()[0].msg
      });

  }

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then((result) => {
      console.log("product has been created", result);
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("Products isnt created", err);
    });
  
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  console.log('IN GET EDIT PRODUCT')

  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;

  Product.findById(prodId)
    .then((product) => {
      return res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        hasError: false,
        product: product,
        // errorMessage: null
      });
    })
    .catch((err) => {
      // Handle other errors (e.g., database connection issues)
      console.log(err);
      res.status(500).render("500", {
        pageTitle: "Internal Server Error",
        path: "/500",
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req)

  // if(!errors.isEmpty()){
  //   console.log('in post edit')
  //   return res.status(422).render("admin/edit-product", {
  //     pageTitle: "Add Product",
  //     path: "/admin/edit-product",
  //     editing: true,
  //     hasError : true,
  //     product: {
  //       title : updatedTitle ,
  //       imageUrl : updatedImageUrl,
  //       price  : updatedPrice,
  //       description : updatedDesc
  //     },
  //     errorMessage : errors.array()[0].msg
  //   });
  // }

  
  Product.findOne({_id : prodId , userId: req.user._id})
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      return product.save();
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log("product isnt updated", err);
      return res.redirect('/')
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId : req.user._id})
    // .select("title price -_id")
    // .populate("userId", "name")
    .then((products) => {
      console.log(products)
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
        
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByIdAndRemove(prodId)
  Product.deleteOne({_id : prodId , userId : req.user._id})
    .then(() => {
      console.log("product is deleted");
      res.redirect("/");
    })
    .catch((err) => {
      console.log("product is not deleted", err);
    });
};
