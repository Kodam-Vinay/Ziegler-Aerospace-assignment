const { UserModel } = require("../../db/model/userModel");
const { v4: uniqueId } = require("uuid");
const jwt = require("jsonwebtoken");
const { OrderModel } = require("../../db/model/orderModel");

// Authorization Middleware
const authorize = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      console.log("decoded", decoded);
      // const checkUserExist = await UserModel.findOne({ user_id: user_id });
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};

const buyOrder = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).send({ message: "Product required" });
    }

    const findUser = await UserModel.findOne({ user_id });

    if (!findUser) {
      return res.status(400).send({ message: "User ID does not exist" });
    }

    const checkUserType = findUser?.user_type;

    if (checkUserType !== "buyer") {
      return res
        .status(400)
        .send({ message: "You are not allowed to buy product" });
    }

    const newOrder = new OrderModel({
      order_id: uniqueId(),
      user_id,
      product_id,
    });

    const orderDetails = await newOrder.save();
    res
      .status(201)
      .send({ message: "Order Placed Successfully", orderDetails });
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const retrieveAllOrders = async (req, res) => {
  try {
    const allOrders = await OrderModel.find();
    if (allOrders?.length > 0) {
      return allOrders;
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const retrieveAllordersbyUserId = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    console.log("user_id", user_id);
    const allOrders = await OrderModel.find({ user_id: user_id });
    if (allOrders?.length > 0) {
      // return res.status(200).send(allProducts);
      return allOrders;
    } else {
      return [];
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const checkUserExist = await UserModel.findOne({ user_id: user_id });
    // console.log("checkUserExit", checkUserExist);
    if (checkUserExist) {
      if (checkUserExist.user_type === "buyer") {
        const data = await retrieveAllordersbyUserId(req, res);
        return res.status(200).send(data);
      } else if (checkUserExist.user_type === "admin") {
        const data = await retrieveAllOrders(req, res);
        return res.status(200).send(data);
      }
    } else {
      return res.status(400).send({ message: "No User found" });
    }
  } catch (error) {
    return res.status(400).send({ message: "Something error occurred" });
  }
};

const getAllOrdersByid = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const { order_id } = req.params;
    const checkUserExist = await UserModel.findOne({ user_id: user_id });
    // console.log("checkUserExit", checkUserExist);
    if (checkUserExist) {
      if (checkUserExist.user_type === "buyer") {
        const data = await retrieveAllordersbyUserId(req, res);
        return res.status(200).send(data);
      } else if (checkUserExist.user_type === "admin") {
        const data = await retrieveAllOrders(req, res);
        return res.status(200).send(data);
      }
    } else {
      return res.status(400).send({ message: "No User found" });
    }
  } catch (error) {
    return res.status(400).send({ message: "Something error occurred" });
  }
};

module.exports = {
  authorize,
  buyOrder,
  authorize,
  getAllOrders,
  getAllOrdersByid,
};
