const express = require("express");
const {
  registerUser,
  loginUser,
  serveradderss,
} = require("../src/auth/authUser");
const {
  getAllUsers,
  deleteUser,
  authorize,
} = require("../src/controllers/userController");
const router = express.Router();
router.get("/info", serveradderss);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", authorize, getAllUsers);
router.delete("/delete-user/:user_id", authorize, deleteUser);

module.exports = {
  userRouter: router,
};
