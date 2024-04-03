const express = require("express");
const { registerUser, loginUser } = require("../src/auth/authUser");
const { getAllUsers } = require("../src/controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin", getAllUsers);

module.exports = {
  userRouter: router,
};
