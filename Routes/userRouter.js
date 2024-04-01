const express = require("express");
const { registerUser, loginUser } = require("../src/auth/authUser");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = {
  userRouter: router,
};
