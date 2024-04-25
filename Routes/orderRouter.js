const express = require("express");
const { authorize } = require("../utils/constants");
const {
  storeOrderInDb,
  getProductsById,
} = require("../src/controllers/orderController");
const router = express.Router();

router.post("/store-orders", authorize, storeOrderInDb);
router.get("/seller-orders", authorize, getProductsById);

module.exports = {
  orderRouter: router,
};
