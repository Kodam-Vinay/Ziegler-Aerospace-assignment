const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    minLength: 4,
  },
  product_id: {
    type: String,
    required: true,
    minLength: 4,
  },
  user_id: {
    type: String,
    required: true,
    minLength: 4,
  },
  price: {
    type: Number,
    required: true,
  },
});
const OrderModel = new mongoose.model("Order", orderSchema);
module.exports = {
  OrderModel,
};
