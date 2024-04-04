const { UserModel } = require("../../db/model/model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const retrieveAllUsers = async (req, res, id) => {
  try {
    const allUsersExceptCurrent = await UserModel.find({
      user_id: { $ne: id },
    });
    const filterData = allUsersExceptCurrent?.map((each) => {
      return {
        user_id: each?.user_id,
        user_type: each?.user_type,
        name: each?.name,
        image: each?.image,
      };
    });

    if (allUsersExceptCurrent?.length > 0) {
      return filterData;
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    let jwtToken;

    const { user_id, user_type } = req.body;
    if (!user_id) return;
    const checkUserExist = await UserModel.findOne({ user_id });
    if (checkUserExist) {
      if (checkUserExist?.user_type !== "admin") {
        return res
          .status(401)
          .send({ message: "This Access is Limited to admins" });
      }
    } else if (!checkUserExist) {
      return res.status(401).send({ message: "User Not Exist" });
    }

    const authHeader = req.headers["authorization"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken && user_type === "admin") {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          const data = await retrieveAllUsers(req, res, user_id);
          res.status(200).send(data);
        }
      });
    } else if (jwtToken && user_type !== "admin") {
      res.status(401).send({ message: "This Access is Limited to admins" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

const deleteUser = async (req, res) => {
  try {
    let jwtToken;
    const { user_id, admin_id } = req.body;
    if (!user_id || !admin_id) return;
    const checkIsAdminOrNot = await UserModel.findOne({ user_id: admin_id });
    const checkUserExist = await UserModel.findOne({ user_id });
    if (!checkIsAdminOrNot || !checkUserExist) {
      return res.status(404).send({ message: "User Not Exist" });
    } else {
      if (checkIsAdminOrNot?.user_type !== "admin") {
        return res
          .status(400)
          .send({ message: "This Access is Limited to admins" });
      }
    }
    const authHeader = req.headers["authorization"];

    if (authHeader) {
      jwtToken = authHeader.split(" ")[1];
    }

    if (jwtToken) {
      jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, async (err, user) => {
        if (err) {
          res
            .status(401)
            .send({ message: "You Didn't have permission to access" });
        } else {
          await UserModel.findOneAndDelete({ user_id: user_id });
          res.status(200).send({ message: "User Deleted Successfully" });
        }
      });
    } else if (jwtToken && user_type !== "admin") {
      res.status(401).send({ message: "This Access is Limited to admins" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error is Happend" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};
