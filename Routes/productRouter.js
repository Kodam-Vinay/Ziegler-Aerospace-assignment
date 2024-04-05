const express = require("express");
const {
  addProduct,
  getAllProducts,
} = require("../src/controllers/productController");
const router = express.Router();

router.post("/add-product", addProduct);
router.post("/all-products", getAllProducts);

module.exports = {
  productRouter: router,
};
