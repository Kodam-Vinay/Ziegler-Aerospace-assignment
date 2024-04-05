const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    minLength: 4,
  },
  product_name: {
    type: String,
    required: true,
    minLength: 4,
  },
  product_image: {
    type: String,
    required: true,
    default: "NO_PRODUCT_IMAGE.png",
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
});
const ProductModel = new mongoose.model("Product", productSchema);
module.exports = {
  ProductModel,
};
