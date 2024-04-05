const express = require("express");
const { addProduct } = require("../src/controllers/productController");
const router = express.Router();

router.post("/add-product", addProduct);

module.exports = {
  productRouter: router,
};
