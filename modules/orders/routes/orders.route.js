const express = require("express");

const OrderService = require("../services/order.service");

const orderService = new OrderService();
const router = express.Router();

module.exports = router;
