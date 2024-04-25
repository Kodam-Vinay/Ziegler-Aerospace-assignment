const { ProductModel } = require("../../db/model/productModel");
const { UserModel } = require("../../db/model/userModel");
const { v4: uniqueId } = require("uuid");
const jwt = require("jsonwebtoken");

// Authorization Middleware

const addProduct = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const {
      product_name,
      product_image,
      product_price,
      rating,
      category,
      specifications,
      is_premium_product,
    } = req.body;
    if (
      !product_name ||
      !product_price ||
      !rating ||
      !category ||
      !specifications
    ) {
      return res.status(400).send({ message: "Fields Must Not Be Empty" });
    }

    const findUser = await UserModel.findOne({ user_id });

    if (!findUser) {
      return res.status(400).send({ message: "User ID does not exist" });
    }

    const checkUserType = findUser?.user_type;

    if (checkUserType !== "seller") {
      return res
        .status(400)
        .send({ message: "You are not allowed to add product" });
    }

    const newProduct = new ProductModel({
      product_id: uniqueId(),
      product_name,
      product_image: product_image ? product_image : "NO-PRODUCT-IMAGE",
      product_price,
      rating,
      category,
      specifications,
      seller_id: user_id,
      is_premium_product,
    });

    const productDetails = await newProduct.save();

    res
      .status(201)
      .send({ message: "Product Added Successfully", productDetails });
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const retrieveAllProducts = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    if (allProducts?.length > 0) {
      return allProducts;
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const retrieveAllProductsbyUserId = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const allProducts = await ProductModel.find({ seller_id: user_id });
    if (allProducts?.length > 0) {
      // return res.status(200).send(allProducts);
      return allProducts;
    } else {
      return [];
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const checkUserExist = await UserModel.findOne({ user_id: user_id });
    if (checkUserExist) {
      if (checkUserExist.user_type === "seller") {
        const data = await retrieveAllProductsbyUserId(req, res);
        return res.status(200).send(data);
      } else {
        const data = await retrieveAllProducts(req, res);
        return res.status(200).send(data);
      }
    } else {
      return res.status(400).send({ message: "No User found" });
    }
  } catch (error) {
    return res.status(400).send({ message: "Something error occurred" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const { product_id } = req.params;

    const {
      product_name,
      product_image,
      product_price,
      rating,
      category,
      specifications,
      is_premium_product,
    } = req.body;

    if (
      !user_id ||
      !product_name ||
      !product_price ||
      !rating ||
      !category ||
      !specifications
    ) {
      return res.status(400).send({ message: "Fields Must Not Be Empty" });
    }

    const findUser = await UserModel.findOne({ user_id });
    const findProduct = await ProductModel.findOne({ product_id });

    if (!findUser) {
      return res.status(400).send({ message: "User ID does not exist" });
    }

    if (!findProduct) {
      return res.status(400).send({ message: "Product not Exist" });
    }

    const checkUserType = findUser?.user_type;

    if (checkUserType !== "seller") {
      return res
        .status(400)
        .send({ message: "You are not allowed to update product" });
    }

    const updatedProductData = {
      product_name: product_name,
      product_image: product_image ? product_image : "NO_PRODUCT_IMAGE.png",
      product_price: product_price,
      rating: rating,
      category: category,
      specifications: specifications,
      is_premium_product,
    };

    await ProductModel.updateOne(
      { product_id: product_id },
      { $set: updatedProductData },
      { new: true }
    );

    res.status(202).send({ message: "Product updated successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const { product_id } = req.params;

    if (!user_id || !product_id)
      return res
        .status(400)
        .send({ message: "User ID and Product ID are required" });

    const checkUserExist = await UserModel.findOne({ user_id });
    const checkProductExist = await ProductModel.findOne({ product_id });

    if (!checkUserExist) {
      return res.status(404).send({ message: "User Not Exist" });
    }

    if (!checkProductExist) {
      return res.status(404).send({ message: "Product Not Exist" });
    }

    if (checkUserExist?.user_type !== "seller") {
      return res
        .status(400)
        .send({ message: "This Access is Limited to sellers" });
    }

    await ProductModel.findOneAndDelete({ product_id });

    res.status(200).send({
      product_id,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  retrieveAllProductsbyUserId,
};
