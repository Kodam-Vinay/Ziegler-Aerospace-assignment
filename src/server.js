const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { userRouter } = require("../Routes/userRouter");
const { productRouter } = require("../Routes/productRouter");
const { orderRouter } = require("../Routes/orderRouter");
require("../db/connection");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/order-details", orderRouter);

app.listen(PORT, () => {
  console.log(`server running at port: ${PORT}`);
});
