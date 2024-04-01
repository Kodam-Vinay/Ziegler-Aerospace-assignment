const jwt = require("jsonwebtoken");
require("dotenv").config();

const MONGO_URL = "mongodb+srv://user:pass@cluster7.wurgn37.mongodb.net/";
const generateToken = ({ userDetails }) => {
  return jwt.sign({ userDetails }, process.env.JWT_SECRET_KEY);
};
module.exports = {
  MONGO_URL,
  generateToken,
};
