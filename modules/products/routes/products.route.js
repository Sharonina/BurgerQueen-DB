const express = require("express");
const {
  verifyTokenMiddleware,
  isAdminMiddleware,
} = require("../../../middleware/auth");

const ProductService = require("../services/product.service");

const productService = new ProductService();
const router = express.Router();

router.use(verifyTokenMiddleware);

router.get("/", async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const products = await productService.getAllProducts(limit, page);
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await productService.getProductById(productId);
    res.status(200).send(product);
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
