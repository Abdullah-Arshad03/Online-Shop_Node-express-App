const Product = require("../models/product");
const mongodb = require("mongodb");
const mongoose = require('mongoose')
const {validationResult} = require('express-validator')

exports.getAddProduct = (req, res, next) => {
  
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage : '', 
    hasError : false,
    validationErrors : []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req)
  console.log('yeh image hy ',image)

  if(!image){
    return  res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      hasError : true,
      product: {
        title : title,
        price : price,
        description : description
      },
      errorMessage : 'Attached File is not image',
      validationErrors : []

    });
  }


  const imageUrl = image.path


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
        errorMessage : errors.array()[0].msg,
        validationErrors : errors.array()

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
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
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
        errorMessage: null,
        validationErrors : [],

      });
    })
    .catch((err) => {
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const errors = validationResult(req)

 
  if(!errors.isEmpty()){
       return  res.status(422).render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: true,
        hasError : true,
        product: {
          title : updatedTitle,
          imageUrl : updatedImageUrl,
          price : updatedPrice,
          description : updatedDesc,
          _id : prodId
        },
          errorMessage : errors.array()[0].msg,
          validationErrors : errors.array()
      });

  }

  
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
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
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
      const error = new Error (err)
      error.httpStatusCode = 500
      return next(error)
    });
};
