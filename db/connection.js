const mongoose = require("mongoose");
const { MONGO_URL } = require("../utils/constants");
require("dotenv").config();

const URL = MONGO_URL.replace(
  "user:pass",
  process.env.USER_NAME + ":" + process.env.PASSWORD
);

mongoose
  .connect(URL)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log("connection failed due to" + err.message);
  });
