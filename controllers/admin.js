const Product = require('../models/product');
const mongodb = require('mongodb')
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title , price , imageUrl , description , null , req.user._id)
  product.save().then((result)=>{
    console.log('this is the product',result)
    res.redirect('/products')
  }).catch((err)=>{
    console.log(err)
  })
};



exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product)=>{

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
    
  }).catch((err)=>{console.log(err)}) 
  }

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
   const product = new Product( updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, prodId )
   product.save().then((result)=>{
    console.log('product has been updated !' , result)
    res.redirect('/admin/products')
  }
  )
  .catch((err)=>{
    console.log(err)
  })
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll().then((products)=>{
    res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  })}).catch((err)=>{
    console.log(err)
  })
}
  
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.deleteById(prodId).then(()=>{
    console.log('product is deleted')
    res.redirect('/')

  }).catch((err)=>{console.log('product is not deleted', err)})
  // Product.findByPk(prodId).then((product)=>{
  //   product.destroy().then((result)=>{
  //     console.log('Product is destroyed!')
  //     res.redirect('/admin/products');
  //   })
  // }).catch((err)=>{console.log(err)})
};
