const express = require("express");
const { registerUser, loginUser } = require("../src/auth/authUser");
const {
  getAllUsers,
  deleteUser,
} = require("../src/controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/all-users", getAllUsers);
router.delete("/delete-user", deleteUser);

module.exports = {
  userRouter: router,
};
