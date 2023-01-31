const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { errorObject } = require("../../../utils/errors.utils");
const mongoose = require("mongoose");

const UserModel = require("../models/user.model");
const { HASH_STEPS, JWT_SECRET } = process.env;

class UserService {
  roles = ["mesero", "cocinero"];
  constructor() {} // dejar en caso de querer añadir atributos

  // get all users
  async getAllUsers(limit = 5, page = 1) {
    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit y page deben ser números");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit y page deben ser mayor a 1");
    }
    return await UserModel.find()
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
  }

  // get user by id
  async getUserById(userId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    if (!isMongoId) {
      throw errorObject(400, "Id de usuario invalido");
    }
    const user = await UserModel.findById(userId).exec();
    if (!user) {
      throw errorObject(404, "Usuario no encontrado");
    }
    return user;
  }

  // create user
  async createUser(userData) {
    // validate request
    const { first_name, last_name, email, password, role, admin } = userData;
    if (!(email && password && first_name && last_name && role)) {
      throw errorObject(400, "Todos los campos son requeridos");
    }

    if (!this.roles.includes(role)) {
      throw errorObject(400, "El role debe ser mesero o cocinero");
    }

    // check if user already exist
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      throw errorObject(409, "Usuario registrado. Por favor inicia sesión");
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
      throw errorObject(400, "Id de usuario invalido");
    }

    if (role && !this.roles.includes(role)) {
      throw errorObject(400, "El role debe ser mesero o cocinero");
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
      throw errorObject(404, "usuario no encontrado");
    }
    return user;
  }

  // delete user by id
  async deleteUserById(userId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(userId);
    if (!isMongoId) {
      throw errorObject(400, "Id de usuario invalido");
    }
    const user = await UserModel.findByIdAndDelete(userId).exec();
    if (!user) {
      throw errorObject(404, "Usuario no encontrado");
    }
    return user;
  }

  //login user
  async login(userDate) {
    const { email, password } = userDate;
    if (!(email && password)) {
      throw errorObject(400, "Todos los campos son requeridos");
    }
    const user = await UserModel.findOne({ email }).exec();
    if (!user) {
      throw errorObject(400, "Credenciales invalidas");
    }
    const isPasswordValid = await bcrypt.compere(password, user.password);
    if (!isPasswordValid) {
      throw errorObject(400, "Credenciales invalidas");
    }
    const token = jwt.sign({ user_id: user._id, email }, JWT_SECRET, {
      expiresIn: "24h",
    });
    const expireDate = new Date().setDate(new Date().getDate() + 1);
    return { token, expireDate };
  }
}

module.exports = UserService;
