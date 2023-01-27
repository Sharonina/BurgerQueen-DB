const express = require("express");

const UserService = require("../services/user.service");

const userService = new UserService();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const users = await userService.getAllUsers(limit, page);
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const user = await userService.createUser(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:userId", async (req, res, next) => {
  try {
    const body = req.body;
    const { userId } = req.params;
    const user = await userService.updateUserById(userId, body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.deleteUserById(userId);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res) => {
  //login logica aqui
});

module.exports = router;
