const { errorObject } = require("../../../utils/errors.utils");
const mongoose = require("mongoose");

const ProductModel = require("../models/product.model");
const RestaurantService = require("../../restaurants/services/restaurant.service");

restaurantService = new RestaurantService();

class ProductService {
  constructor() {}

  // get all products
  async getAllProducts(limit = 5, page = 1) {
    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit and page must be numbers");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit and page must be greater than 1");
    }
    return await ProductModel.find()
      .populate("restaurant")
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
  }

  // get product by id
  async getProductById(productId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid id product");
    }
    const product = await ProductModel.findById(productId)
      .populate("restaurant")
      .exec();
    if (!product) {
      throw errorObject(404, "Product not found");
    }
    return product;
  }

  // create product
  async createProduct(productData) {
    // validate request
    const { name, price, type, image, restaurant } = productData;
    if (!(name && price && type)) {
      throw errorObject(400, "All input is required");
    }

    // check if product already exist
    const oldProduct = await ProductModel.findOne({ name });
    if (oldProduct) {
      throw errorObject(409, "Product already exist");
    }

    // check if restaurant id is valid
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurant);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }

    // validate retaurant existance
    const restaurantExist = await restaurantService.getRestaurantById(
      restaurant
    );
    if (!restaurantExist) {
      throw errorObject(400, "Restaurant not found");
    }

    // create product in db
    const product = await ProductModel.create({
      name, //lo mismo a hacer name:name
      price,
      type,
      image,
      restaurant,
      date_entry: new Date(),
    });

    //return new product
    product.save();
    return { product };
  }

  // update product by id
  async updateProductById(productId, productData) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid product id");
    }

    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: productData }, // para que no genere dobles
      { new: true }
    ).exec();

    if (!product) {
      throw errorObject(404, "Product not found");
    }
    return product;
  }

  // delete product by id
  async deleteProductById(productId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid product id");
    }
    const product = await ProductModel.findByIdAndDelete(productId).exec();
    if (!product) {
      throw errorObject(404, "Product not found");
    }
    return product;
  }
}

module.exports = ProductService;
