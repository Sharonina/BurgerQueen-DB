const { errorObject } = require("../../../utils/errors.utils");
const mongoose = require("mongoose");

const RestaurantModel = require("../models/restaurant.model");

class RestaurantService {
  constructor() {} // dejar en caso de querer añadir atributos

  // get restaurant by id
  async getUserById(restaurantId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Id de restaurante invalido");
    }
    const restaurant = await RestaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw errorObject(404, "Restaurante no encontrado");
    }
    return restaurant;
  }

  // create restaurant
  async createRestaurant(restaurantData) {
    // validate request
    const { name } = restaurantData;
    if (!name) {
      throw errorObject(400, "Todos los campos son requeridos");
    }

    // check if restaurant already exist
    const oldRestaurant = await RestaurantModel.findOne({ email });
    if (oldRestaurant) {
      throw errorObject(409, "Este restaurante ya se encuentra registrado");
    }

    // create restaurant in db
    const newRestaurant = await new RestaurantModel(restaurant);
    return newRestaurant.save();
  }

  // update restaurant by id
  async updateRestaurantById(restaurantId, restaurantData) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Id de restaurante invalido");
    }

    const { name } = restaurantData;
    if (!name) {
      throw errorObject(404, "Restaurante no encontrado");
    }
    return RestaurantModel.findByIdAndUpdate(restaurantId, restaurantData);
  }

  // delete restaurant by id
  async deleteRestaurantById(restaurantId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurantId);
    if (!isMongoId) {
      throw errorObject(400, "Id de restaurante invalido");
    }
    const restaurant = await RestaurantModel.findByIdAndDelete(
      restaurantId
    ).exec();
    if (!restaurant) {
      throw errorObject(404, "Restaurante no encontrado");
    }
    return restaurant;
  }
}

module.exports = RestaurantService;
