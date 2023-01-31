const express = require("express");
const {
  verifyTokenMiddleware,
  isAdminMiddleware,
} = require("../../../middleware/auth");

const RestaurantService = require("../services/restaurant.service");

const restaurantService = new RestaurantService();
const router = express.Router();

router.use(verifyTokenMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const restaurants = await restaurantService.getAllURestaurant(limit, page);
    res.status(200).send(restaurants);
  } catch (error) {
    next(error);
  }
});

router.get("/:restaurantId", async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.getRestaurantById(restaurantId);
    res.status(200).send(restaurant);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAdminMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const restaurant = await restaurantService.createRestaurant(body);
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
});

router.put("/:restaurantId", isAdminMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.updateRestaurantById(
      restaurantId,
      body
    );
    res.status(200).send(restaurant);
  } catch (error) {
    next(error);
  }
});

router.delete("/:restaurantId", isAdminMiddleware, async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.deleteRestaurantById(
      restaurantId
    );
    res.status(200).send(restaurant);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
