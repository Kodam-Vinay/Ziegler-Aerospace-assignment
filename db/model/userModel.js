const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
      minLength: 4,
      unique: true,
    },
    user_type: {
      type: String,
      required: true,
      default: "buyer",
    },
    name: {
      type: String,
      required: true,
      minLength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    image: {
      type: String,
      default: "DUMMY_PROFILE_LOGO.png",
    },
    is_premium_user: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = {
  UserModel,
};
