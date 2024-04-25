const { OrderModel } = require("../../db/model/orderModel");
const { UserModel } = require("../../db/model/userModel");

const storeOrderInDb = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const orders = req.body;
    const findUser = await UserModel.findOne({ user_id });

    if (!findUser) {
      return res.status(400).send({ message: "User ID does not exist" });
    }

    const checkBuyerType = findUser?.user_type;

    if (checkBuyerType !== "buyer") {
      return res
        .status(400)
        .send({ message: "You Are not allowed to buy the product" });
    }

    await orders.map(async (order) => {
      const resp = new OrderModel({
        product_id: order.product_id,
        product_name: order.product_name,
        product_image: order.product_image
          ? order.product_image
          : "NO-PRODUCT-IMAGE",
        product_price: order.product_price,
        rating: order.rating,
        category: order.category,
        specifications: order.specifications,
        seller_id: order.seller_id,
        buyer_id: user_id,
        ordered_count: order.ItemsInCart,
      });
      await resp.save();
    });
    res.status(200).send({ message: "orders Added Successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const getProductsById = async (req, res) => {
  try {
    const { user_id } = req?.user?.userDetails;
    const allProducts = await OrderModel.find({ seller_id: user_id });
    res.status(200).send(allProducts);
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};
module.exports = {
  getProductsById,
  storeOrderInDb,
};
