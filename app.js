require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./config/database").connect();
const UserModel = require("./model/user");

const { HASH_STEPS, JWT_SECRET } = process.env;

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await UserModel.find().exec();
  res.status(200).send(users);
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const users = await UserModel.findById(userId).exec();
  res.status(200).send(users);
});

app.post("/users", async (req, res) => {
  try {
    // validate request
    const { first_name, last_name, email, password } = req.body;
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("Todos los campos son requeridos");
    }

    // check if user already exist
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .send("Usuario registrado. Por favor inicia sesión");
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

    user.save();

    //return new user
    const expireDate = new Date().setDate(new Date().getDate() + 1);
    res.status(201).json({ token: token, expireDate });
  } catch (error) {
    console.log(error);
  }
});

// put
// delete

app.post("/login", (req, res) => {
  //login logica aqui
});

module.exports = app;
