const express = require("express");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  authorize,
  retrieveAllProductsbyUserId,
} = require("../src/controllers/productController");
const router = express.Router();

router.post("/add-product", authorize, addProduct);
router.post("/all-products", authorize, getAllProducts);
router.post("/seller-products", authorize, retrieveAllProductsbyUserId);

router.delete("/delete-product", authorize, deleteProduct);
router.put("/update-product", authorize, updateProduct);

module.exports = {
  productRouter: router,
};
