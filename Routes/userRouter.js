const express = require("express");
const { registerUser, loginUser, updateUser } = require("../src/auth/authUser");
const {
  getAllUsers,
  deleteUser,
} = require("../src/controllers/userController");
const { authorize } = require("../utils/constants");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authorize, getAllUsers);
router.put("/update-user", authorize, updateUser);
router.delete("/delete-user", authorize, deleteUser);

module.exports = {
  userRouter: router,
};
