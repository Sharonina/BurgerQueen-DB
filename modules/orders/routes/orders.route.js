const express = require("express");

const { verifyTokenMiddleware } = require("../../../middleware/auth");
const OrderService = require("../services/order.service");
const UserService = require("../../users/services/user.service");

const orderService = new OrderService();
const router = express.Router();
const userService = new UserService();

router.use(verifyTokenMiddleware);

// get all orders
router.get("/", async (req, res, next) => {
  try {
    const { limit, page, byCategory } = req.query;
    const { authorization } = req.headers;
    const { restaurant } = await userService.getUserByToken(authorization);
    const orders = await orderService.getAllOrders(
      restaurant,
      limit,
      page,
      byCategory
    );
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
});

// get order by id
router.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

// create order
router.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const order = await orderService.createOrder(body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

// update order status
router.put("/:orderId/status", async (req, res, next) => {
  try {
    const body = req.body;
    const { orderId } = req.params;
    const order = await orderService.updateOrderStatusById(orderId, body);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

// update order by Id
router.put("/:orderId", async (req, res, next) => {
  try {
    const body = req.body;
    const { orderId } = req.params;
    const order = await orderService.updateOrderById(orderId, body);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

// delete order
router.delete("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.deleteOrderById(orderId);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
