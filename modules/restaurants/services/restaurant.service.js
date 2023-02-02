const { errorObject } = require("../../../utils/errors.utils");
const mongoose = require("mongoose");

const RestaurantModel = require("../models/restaurant.model");

class RestaurantService {
  constructor() {} // dejar en caso de querer añadir atributos

  // get restaurant by id
  async getRestaurantById(restaurantId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }
    const restaurant = await RestaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw errorObject(404, "Restaurant not found");
    }
    return restaurant;
  }

  // create restaurant
  async createRestaurant(restaurantData) {
    // validate request
    const { name } = restaurantData;
    if (!name) {
      throw errorObject(400, "All input is required");
    }

    // create restaurant in db
    const newRestaurant = await new RestaurantModel(restaurantData);
    return newRestaurant.save();
  }

  // update restaurant by id
  async updateRestaurantById(restaurantId, restaurantData) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }

    const { name } = restaurantData;
    if (!name) {
      throw errorObject(404, "Restaurant not found");
    }
    return RestaurantModel.findByIdAndUpdate(restaurantId, restaurantData);
  }

  // delete restaurant by id
  async deleteRestaurantById(restaurantId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }
    const restaurant = await RestaurantModel.findByIdAndDelete(
      restaurantId
    ).exec();
    if (!restaurant) {
      throw errorObject(404, "Restaurant not found");
    }
    return restaurant;
  }
}

module.exports = RestaurantService;
