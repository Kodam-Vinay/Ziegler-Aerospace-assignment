const { UserModel } = require("../../db/model/userModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// Authorization Middleware
const authorize = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
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

const retrieveAllUsers = async (id) => {
  try {
    const allUsersExceptCurrent = await UserModel.find({
      user_id: { $ne: id },
    });
    const filterData = allUsersExceptCurrent?.map((each) => ({
      user_id: each?.user_id,
      user_type: each?.user_type,
      name: each?.name,
      image: each?.image,
    }));

    if (allUsersExceptCurrent?.length > 0) {
      return filterData;
    }
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { user_id, user_type } = req.body;

    const checkUserExist = await UserModel.findOne({ user_id });

    if (!checkUserExist || checkUserExist.user_type !== "admin") {
      return res
        .status(401)
        .send({ message: "This Access is Limited to admins" });
    }

    const authHeader = req.headers["authorization"];
    let jwtToken;

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
          const data = await retrieveAllUsers(user_id);
          res.status(200).send(data);
        }
      });
    } else if (jwtToken && user_type !== "admin") {
      res.status(401).send({ message: "This Access is Limited to admins" });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id, admin_id } = req.body;

    if (!user_id || !admin_id)
      return res
        .status(400)
        .send({ message: "User ID and Admin ID are required" });

    const checkIsAdminOrNot = await UserModel.findOne({ user_id: admin_id });
    const checkUserExist = await UserModel.findOne({ user_id });

    if (!checkIsAdminOrNot || !checkUserExist) {
      return res.status(404).send({ message: "User Not Exist" });
    }

    if (checkIsAdminOrNot?.user_type !== "admin") {
      return res
        .status(400)
        .send({ message: "This Access is Limited to admins" });
    }

    const authHeader = req.headers["authorization"];
    let jwtToken;

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
          const data = await UserModel.findOneAndDelete({ user_id });
          res.status(200).send({
            user_id: data?.user_id,
            message: "User Deleted Successfully",
          });
        }
      });
    } else {
      res.status(401).send({ message: "You Didn't have permission to access" });
    }
  } catch (error) {
    res.status(400).send({ message: "Something error occurred" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  authorize,
};
