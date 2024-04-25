const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      minLength: 4,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    specifications: {
      type: Array,
      required: true,
    },
    seller_id: {
      type: String,
      required: true,
    },
    buyer_id: {
      type: String,
      required: true,
    },
    ordered_count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OrderModel = mongoose.model("Order", orderSchema);
module.exports = {
  OrderModel,
};
