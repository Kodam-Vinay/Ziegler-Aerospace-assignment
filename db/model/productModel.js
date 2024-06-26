const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
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
      default: "NO-PRODUCT-IMAGE",
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
    is_premium_product: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const ProductModel = mongoose.model("Product", productSchema);
module.exports = {
  ProductModel,
};
