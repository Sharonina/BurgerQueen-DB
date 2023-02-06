const express = require("express");
const {
  verifyTokenMiddleware,
  isAdminMiddleware,
  hasAdminRegisterKeyMiddleware,
} = require("../../../middleware/auth");

const UserService = require("../services/user.service");
const RestaurantService = require("../../restaurants/services/restaurant.service");

const userService = new UserService();
const restaurantService = new RestaurantService();
const router = express.Router();

const authenticationMiddlewares = [verifyTokenMiddleware];
const adminMiddlewares = [...authenticationMiddlewares, isAdminMiddleware];

router.get("/", adminMiddlewares, async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const users = await userService.getAllUsers(limit, page);
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", adminMiddlewares, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(userId);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/admin", hasAdminRegisterKeyMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const { restaurant: restaurantData, admin: adminData } = body;
    adminData.admin = true;
    const restaurant = await restaurantService.createRestaurant(restaurantData);
    adminData.restaurant = restaurant._id.toString();
    const user = await userService.createUser(adminData);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", adminMiddlewares, async (req, res, next) => {
  try {
    const body = req.body;
    const user = await userService.createUser(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:userId", adminMiddlewares, async (req, res, next) => {
  try {
    const body = req.body;
    const { userId } = req.params;
    const user = await userService.updateUserById(userId, body);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:userId", adminMiddlewares, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userService.deleteUserById(userId);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const body = req.body;
    const loginResponse = await userService.login(body);
    res.status(200).send(loginResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
