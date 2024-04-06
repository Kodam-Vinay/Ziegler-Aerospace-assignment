const { ProductModel } = require("../../db/model/productModel");
const { UserModel } = require("../../db/model/userModel");
const { v4: uniqueId } = require("uuid");
const jwt = require("jsonwebtoken");

const addProduct = async (req, res) => {
  try {
    let jwtToken;
    const {
      user_id,
      product_name,
      product_image,
      product_price,
      rating,
      category,
      specifications,
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

    const authHeader = req.headers["authorization"];
    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    const findUser = await UserModel.findOne({ user_id });
    if (!findUser) {
      return res.status(400).send({ message: "user Id not Exist" });
    }
    const checkUserType = findUser?.user_type;
    if (checkUserType !== "seller") {
      return res
        .status(400)
        .send({ message: "You are not allowed to add product" });
    }
    if (checkUserType === "seller" && !jwtToken) {
      return res
        .status(400)
        .send({ message: "You are not allowed to add product" });
    }
    const newProduct = new ProductModel({
      product_id: uniqueId(),
      product_name,
      product_image,
      product_price,
      rating,
      category,
      specifications,
    });

    if (jwtToken && findUser?.user_type === "seller") {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          const productDetails = await newProduct.save();
          res
            .status(201)
            .send({ message: "product Added Successfully", productDetails });
        }
      });
    } else if (jwtToken && findUser?.user_type !== "seller") {
      res
        .status(401)
        .send({ message: "This Access is Limited to Sellers only" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
    const productDetails = await newProduct.save();
    res
      .status(201)
      .send({ message: "product Added Successfully", productDetails });
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const retrieveAllProducts = async (req, res, Id) => {
  try {
    const allProducts = await ProductModel.find();
    if (allProducts?.length > 0) {
      return allProducts;
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    let jwtToken;

    const { user_id, user_type } = req.body;
    if (!user_id) return;

    const checkUserExist = await UserModel.findOne({ user_id });
    if (checkUserExist) {
      if (checkUserExist?.user_type !== "seller") {
        return res
          .status(401)
          .send({ message: "This Access is Limited to Sellers only" });
      }
    } else if (!checkUserExist) {
      return res.status(401).send({ message: "User Not Exist" });
    }

    const authHeader = req.headers["authorization"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken && user_type === "seller") {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          const data = await retrieveAllProducts(req, res, user_id);
          res.status(200).send(data);
        }
      });
    } else if (jwtToken && user_type !== "seller") {
      res
        .status(401)
        .send({ message: "This Access is Limited to Sellers only" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const updateProduct = async (req, res) => {
  try {
    let jwtToken;
    const {
      product_id,
      user_id,
      product_name,
      product_image,
      product_price,
      rating,
      category,
      specifications,
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

    const authHeader = req.headers["authorization"];
    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    const findUser = await UserModel.findOne({ user_id });
    const findProduct = await ProductModel.findOne({ product_id });
    if (!findUser) {
      return res.status(400).send({ message: "user Id not Exist" });
    }
    if (!findProduct) {
      return res.status(400).send({ message: "Product not Exist" });
    }
    const checkUserType = findUser?.user_type;
    if (checkUserType !== "seller") {
      return res
        .status(400)
        .send({ message: "You are not allowed to add product" });
    }
    if (checkUserType === "seller" && !jwtToken) {
      return res
        .status(400)
        .send({ message: "You are not allowed to add product" });
    }
    const updatedProductData = {
      product_name: product_name,
      product_image: product_image ? product_image : "NO_PRODUCT_IMAGE.png",
      product_price: product_price,
      rating: rating,
      category: category,
      specifications: specifications,
    };

    if (jwtToken && findUser?.user_type === "seller") {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          await ProductModel.updateOne(
            { product_id: product_id },
            { $set: updatedProductData },
            { new: true }
          );
          res.status(202).send({ message: "product updated successfully" });
        }
      });
    } else if (jwtToken && findUser?.user_type !== "seller") {
      res
        .status(401)
        .send({ message: "This Access is Limited to Sellers only" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    let jwtToken;
    const { user_id, product_id } = req.body;
    if (!user_id || !product_id) return;
    const checkUserExist = await UserModel.findOne({ user_id });
    const checkProductExist = await ProductModel.findOne({ product_id });
    if (!checkUserExist || !checkProductExist) {
      if (!checkUserExist) {
        return res.status(404).send({ message: "User Not Exist" });
      } else if (!checkProductExist) {
        return res.status(404).send({ message: "Product Not Exist" });
      }
    } else {
      if (checkUserExist?.user_type !== "seller") {
        return res
          .status(400)
          .send({ message: "This Access is Limited to sellers" });
      }
    }
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken) {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          const data = await ProductModel.findOneAndDelete({ product_id });
          res.status(200).send({
            user_id: data?.user_id,
            message: "Product Deleted Successfully",
          });
        }
      });
    } else if (jwtToken && user_type !== "seller") {
      res.status(401).send({ message: "This Access is Limited to sellers" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

module.exports = { addProduct, getAllProducts, deleteProduct, updateProduct };
