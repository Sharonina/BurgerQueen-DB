const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorObject } = require("../../../utils/errors.utils");
const { isMongoIdValidation } = require("../../../utils/validation.utils");
const mongoose = require("mongoose");

const UserModel = require("../models/user.model");
const userModel = require("../models/user.model");
const { HASH_STEPS, JWT_SECRET } = process.env;

class UserService {
  roles = ["waiter", "chef", "manager", "admin"];
  constructor() {} // dejar en caso de querer añadir atributos

  // get all users
  async getAllUsers(limit = 5, page = 1) {
    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit and page must be numbers");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit and page must be greater than 1");
    }
    return await UserModel.find()
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
  }

  //get user by token
  async getUserByToken(token) {
    if (!token) {
      throw errorObject(401, "Access denied. No token provided");
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decoded.user_id)
        .populate("restaurant")
        .exec();
      if (!user) {
        throw errorObject(404, "user not found");
      }
      const userWithoutPassword = user.toObject();
      console.log(userWithoutPassword);
      delete userWithoutPassword.password;
      return userWithoutPassword;
    } catch (error) {
      errorObject(401, "Invalid token");
    }
  }

  // get user by id
  async getUserById(userId) {
    //isMongoIdValidation([userId]);
    let user;
    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    if (!isMongoId) {
      user = await UserModel.findOne({ email: userId }).exec();
      if (!user) {
        throw errorObject(400, "Invalid user id");
      }
      return user;
    }
    user = await UserModel.findById(userId).populate("restaurant").exec();
    if (!user) {
      throw errorObject(404, "User not found");
    }
    return user;
  }

  // create user
  async createUser(userData) {
    // validate request
    const { first_name, last_name, email, password, role, admin, restaurant } =
      userData;
    if (!(email && password && first_name && last_name && role)) {
      throw errorObject(400, "All input is required");
    }

    if (!this.roles.includes(role)) {
      throw errorObject(400, "Role must be waiter, chef, manager or admin");
    }

    // check if user already exist
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      throw errorObject(409, "User already exist. Please login");
    }

    // encrypt user password
    const encryptedPassword = await bcrypt.hash(password, parseInt(HASH_STEPS));

    // create user in db
    const user = await UserModel.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      role,
      admin,
      restaurant,
    });

    // create token
    const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    const expireDate = new Date().setDate(new Date().getDate() + 1);

    //return new user
    user.save();
    return { token, expireDate };
  }

  // update user by id
  async updateUserById(userId, userData) {
    const { role, password } = userData;
    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid user id");
    }

    if (role && !this.roles.includes(role)) {
      throw errorObject(400, "Role must be waiter, chef, manager or admin");
    }

    if (password) {
      const encryptedPassword = await bcrypt.hash(
        password,
        parseInt(HASH_STEPS)
      );
      userData.password = encryptedPassword;
    }
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: userData }, // para que no genere dobles
      { new: true } //para que retorne el obj nuevo y no el anterior
    ).exec();

    if (!user) {
      throw errorObject(404, "User not found");
    }
    return user;
  }

  // delete user by id
  async deleteUserById(userId) {
    let user;
    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    if (!isMongoId) {
      user = await UserModel.findOne({ email: userId }).exec();
      if (!user) {
        throw errorObject(400, "Invalid user id");
      }
      user = await userModel.deleteOne({ email: userId });
      return user;
    }
    user = await UserModel.findByIdAndDelete(userId).exec();
    if (!user) {
      throw errorObject(404, "User not found");
    }
    return user;
  }

  //login user
  async login(userData) {
    const { email, password } = userData;
    if (!(email && password)) {
      throw errorObject(400, "All input is required");
    }
    const user = await UserModel.findOne({ email })
      .populate("restaurant")
      .exec();

    if (!user) {
      throw errorObject(404, "Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw errorObject(404, "Invalid credentials");
    }
    const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    const expireDate = new Date().setDate(new Date().getDate() + 1);
    const userInfo = user.toObject();
    return {
      token,
      expireDate,
      userInfo: { ...userInfo, password: undefined },
    };
  }
}

module.exports = UserService;
