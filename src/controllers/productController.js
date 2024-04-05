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

module.exports = { addProduct, getAllProducts };
