const express = require("express");

const OrderService = require("../services/order.service");

const orderService = new OrderService();
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const products = await productService.getAllProducts(limit, page);
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:orderId", async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getProductById(orderId);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

router.post("/", isAdminMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const product = await productService.createProduct(body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:productId", isAdminMiddleware, async (req, res, next) => {
  try {
    const body = req.body;
    const { productId } = req.params;
    const product = await productService.updateProductById(productId, body);
    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

router.delete("/:productId", isAdminMiddleware, async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productService.deleteProductById(productId);
    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
