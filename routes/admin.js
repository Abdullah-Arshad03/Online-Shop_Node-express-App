// const path = require('path');

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");
const { check } = require("express-validator");

const router = express.Router();

// // /admin/add-product => GET
router.get(
  "/add-product",
  isAuth,
  adminController.getAddProduct
);

// // /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post(
  "/add-product",
  [
    check("title", 'Enter Valid Title')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    check("imageUrl", 'Enter Valid ImageUrl').isURL(),
    check("price", 'Enter Valid Input for the price').isFloat(),
    check("description" , 'Enter atleast 15 and atmost 200 characters in Description').isLength({ min: 15, max: 200 }).trim(),
  ],
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", [
    check("title", "Enter valid title edit product")
      .isString()
      .isLength({ min: 3 })
      .trim(),
    check("imageUrl", 'Enter Valid ImageUrl').isURL(),
    check("price", "Enter Valid input for the price").isFloat(),
    check("description", 'Enter atleast 15 and atmost 200 characters in Description').isLength({ min: 15, max: 200 }).trim(),
  ] , isAuth, adminController.postEditProduct);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
