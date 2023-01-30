const express = require("express");

const ProductService = require("../services/product.service");

const productService = new ProductService();
const router = express.Router();

module.exports = router;
