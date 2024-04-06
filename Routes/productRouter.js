const express = require("express");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
} = require("../src/controllers/productController");
const router = express.Router();

router.post("/add-product", addProduct);
router.post("/all-products", getAllProducts);
router.delete("/delete-product", deleteProduct);
router.put("/update-product", updateProduct);

module.exports = {
  productRouter: router,
};
