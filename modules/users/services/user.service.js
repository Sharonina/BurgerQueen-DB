const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");
const { HASH_STEPS, JWT_SECRET } = process.env;

class UserService {
  constructor() {} // dejar en caso de querer añadir atributos

  // get all users
  async getAllUsers(limit = 5, offset = 0) {
    return await UserModel.find().skip(offset).limit(limit).exec();
  }

  // get user by id
  async getUserById(userId) {
    return await UserModel.findById(userId).exec();
  }

  // create user
  async createUser(userData) {
    // validate request
    const { first_name, last_name, email, password } = userData;
    if (!(email && password && first_name && last_name)) {
      const error = new Error("Todos los campos son requeridos");
      error.statusCode = 400;
      throw error;
    }

    // check if user already exist
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      const error = new Error("Usuario registrado. Por favor inicia sesión");
      error.statusCode = 409;
      throw error;
    }

    // encrypt user password
    const encryptedPassword = await bcrypt.hash(password, parseInt(HASH_STEPS));

    // create user in db
    const user = await UserModel.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedPassword,
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
    return await UserModel.findByIdAndUpdate(
      userId,
      { $set: userData }, // para que no genere dobles
      { new: true } //para que retorne el obj nuevo y no el anterior
    ).exec();
  }

  // delete user by id
  async deleteUserById(userId) {
    const user = await UserModel.findByIdAndDelete(userId).exec();
    if (user) {
      return { message: "Usuario eliminado exitosamente" };
    }
    const error = new Error("Usuario no encontrado");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = UserService;
