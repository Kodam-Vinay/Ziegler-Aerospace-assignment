const jwt = require("jsonwebtoken");
require("dotenv").config();

const MONGO_URL = "mongodb+srv://user:pass@cluster7.wurgn37.mongodb.net/";
const generateToken = ({ userDetails }) => {
  return jwt.sign({ userDetails }, process.env.JWT_SECRET_KEY);
};

//authorization middleware

const authorize = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized" });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = {
  MONGO_URL,
  generateToken,
  authorize,
};
