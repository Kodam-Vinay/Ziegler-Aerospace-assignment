const express = require("express");
const {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  retrieveAllProductsbyUserId,
} = require("../src/controllers/productController");
const { authorize } = require("../utils/constants");
const router = express.Router();

router.post("/add-product", authorize, addProduct);
router.get("/all-products", authorize, getAllProducts);
router.get("/seller-products", authorize, retrieveAllProductsbyUserId);

router.delete("/delete-product/:product_id", authorize, deleteProduct);
router.put("/update-product/:product_id", authorize, updateProduct);

module.exports = {
  productRouter: router,
};
