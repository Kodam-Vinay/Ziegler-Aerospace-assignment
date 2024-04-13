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
router.get("/all-products", authorize, getAllProducts);
router.post("/seller-products", authorize, retrieveAllProductsbyUserId);

router.delete("/delete-product/:product_id", authorize, deleteProduct);
router.put("/update-product/:product_id", authorize, updateProduct);

module.exports = {
  productRouter: router,
};
