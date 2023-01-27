const express = require("express");

const UserService = require("../services/user.service");
const UserModel = require("../models/user.model");

const userService = new UserService();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const users = await userService.getAllUsers(limit, offset);
    res.status(200).send(users);
  } catch (error) {
    res.status(error.statusCode || 500).send({ message: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await userService.getUserById(userId);
  res.status(200).send(user);
});

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const user = await userService.createUser(body);
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

router.put("/:userId", async (req, res) => {
  const body = req.body;
  const { userId } = req.params;
  const user = await userService.updateUserById(userId, body);
  res.status(200).send(user);
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await userService.deleteUserById(userId);
  res.status(200).send(user);
});

router.post("/login", (req, res) => {
  //login logica aqui
});

module.exports = router;
