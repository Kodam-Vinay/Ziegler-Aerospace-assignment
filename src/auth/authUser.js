const validator = require("validator");
const bcrypt = require("bcrypt");
const { UserModel } = require("../../db/model/model");
const { generateToken } = require("../../utils/constants");
require("dotenv").config();

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      user_id,
      password,
      confirm_password,
      image,
      user_type,
    } = req.body;

    if (
      !email ||
      !password ||
      !confirm_password ||
      !name ||
      !user_id ||
      !user_type
    ) {
      return res.status(400).send({ message: "Fields must not to be Empty" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Email is Invalid" });
    }

    const userExistsWithEmail = await UserModel.findOne({ email });
    const userExistsWithId = await UserModel.findOne({ user_id });

    if (userExistsWithEmail) {
      return res.status(400).send({ message: "User Email Already Exists" });
    }

    if (userExistsWithId) {
      return res.status(400).send({ message: "User Id Alreadhy Exists" });
    }

    if (name.length < 4) {
      return res.status(400).send({
        message: "Name is Too Short,it should contain at least 4 characters",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).send({
        message: "Both Passwords should Match",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({
        message:
          "Password Not Meet the criteria, it Must includes(password length 8 or more charaters, 1 uppercase letter, 1 special symbol)",
      });
    }

    const salt = parseInt(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new UserModel({
      name,
      user_id,
      email,
      password: hashedPassword,
      image,
      user_type,
    });
    await user.save();

    const userDetails = {
      user_id,
      name,
    };
    const jwtToken = generateToken({ userDetails });
    res.status(200).send({
      name,
      jwtToken,
      image,
      user_type,
    });
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      //login using id
      const userExistsWithId = await UserModel.findOne({ user_id: email });
      if (!userExistsWithId) {
        return res
          .status(400)
          .send({ message: "Please Enter a Valid User Id or Email" });
      } else {
        const checkPassword = await bcrypt.compare(
          password,
          userExistsWithId?.password
        );
        if (!checkPassword) {
          return res
            .status(400)
            .send({ message: "Please Check Your Password" });
        }
        const userDetails = {
          user_id: userExistsWithId?.user_id,
          name: userExistsWithId?.name,
        };
        const jwtToken = generateToken({ userDetails });
        res.status(200).send({
          name: userExistsWithId?.name,
          user_type: userExistsWithId.user_type,
          jwtToken,
        });
      }
    } else {
      //login using email
      const userExistsWithEmail = await UserModel.findOne({ email });
      if (!userExistsWithEmail) {
        return res
          .status(400)
          .send({ message: "Please Enter a Valid User Id or Email" });
      } else {
        const checkPassword = await bcrypt.compare(
          password,
          userExistsWithEmail?.password
        );
        if (!checkPassword) {
          return res
            .status(400)
            .send({ message: "Please Check Your Password" });
        }
        const userDetails = {
          user_id: userExistsWithEmail?.user_id,
          name: userExistsWithEmail?.name,
        };
        const jwtToken = generateToken({ userDetails });
        res.status(200).send({
          name: userExistsWithEmail?.name,
          user_type: userExistsWithEmail.user_type,
          jwtToken,
        });
      }
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
