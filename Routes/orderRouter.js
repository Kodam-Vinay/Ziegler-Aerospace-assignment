const express = require("express");
const {
  buyOrder,
  getAllOrders,
  authorize,
} = require("../src/controllers/orderController");

const router = express.Router();

router.post("/buy-product", authorize, buyOrder);
router.get("/all-orders", authorize, getAllOrders);
router.get("/all-orders/:id", authorize, getAllOrders);

module.exports = {
  orderRouter: router,
};
