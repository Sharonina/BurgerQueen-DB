const mongoose = require("mongoose");

const OrderModel = require("../models/order.model");
const { detailedOrderAggregation } = require("../utils/aggregations.utils");
const RestaurantService = require("../../restaurants/services/restaurant.service");
const { errorObject } = require("../../../utils/errors.utils");

const restaurantService = new RestaurantService();

class OrderService {
  statuses = ["pending", "canceled", "delivering", "delivered"];
  constructor() {}

  // get all orders
  async getAllOrders(restaurant, limit = 10, page = 1) {
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurant);
    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }

    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit and page must be numbers");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit and page must be greater than 1");
    }
    const orderResponse = await OrderModel.aggregate([
      { $match: { restaurant: mongoose.Types.ObjectId(restaurant) } },
      { $skip: limit * (page - 1) },
      { $limit: Number(limit) },
      ...detailedOrderAggregation,
    ]);
    return orderResponse;
  }

  // get order by id
  async getOrderById(orderId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid order id");
    }
    const orderResponse = await OrderModel.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(orderId) } },
      ...detailedOrderAggregation,
    ]);
    return orderResponse;
  }

  // create order
  async createOrder(orderData) {
    // validate request
    const { client, waiter, products, restaurant } = orderData;
    if (!(client && waiter && products && restaurant)) {
      throw errorObject(400, "All input is required");
    }

    // check if restaurant id is valid
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurant);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }

    // validate restaurant existance
    const restaurantExist = await restaurantService.getRestaurantById(
      restaurant
    );
    if (!restaurantExist) {
      throw errorObject(400, "Restaurant not found");
    }

    // create order in db
    const order = await OrderModel.create({
      client,
      waiter,
      status: "pending",
      products,
      restaurant,
      date_entry: new Date(),
      date_processed: null,
    });

    //return new order
    const newOrder = new OrderModel(order);
    return newOrder.save();
  }

  // update order by id
  async updateOrderById(orderId, orderData) {
    const { restaurant } = orderData;
    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);

    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }

    // check if restaurant id is valid
    const restaurantIsMongoId = mongoose.Types.ObjectId.isValid(restaurant);
    if (!restaurantIsMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }

    // validate restaurant existance
    const restaurantExist = await restaurantService.getRestaurantById(
      restaurant
    );
    if (!restaurantExist) {
      throw errorObject(400, "Restaurant not found");
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: orderData }, // para que no genere dobles
      { new: true } //para que retorne el obj nuevo y no el anterior
    ).exec();

    if (!order) {
      throw errorObject(404, "Order not found");
    }
    return order;
  }

  // update order status
  async updateOrderStatusById(orderId, body) {
    const { status } = body;
    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid restaurant id");
    }

    // validate order existance
    const orderExist = await this.getOrderById(orderId);
    if (!orderExist) {
      throw errorObject(400, "Order not found");
    }

    //validate statuses
    if (!this.statuses.includes(status)) {
      throw errorObject(400, "Invalid status");
    }

    if (status === "delivered") {
      return await OrderModel.findByIdAndUpdate(
        orderId,
        {
          status,
          date_processed: new Date(),
        },
        { new: true }
      );
    }

    return await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
  }

  // delete order by id
  async deleteOrderById(orderId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    if (!isMongoId) {
      throw errorObject(400, "Invalid order id");
    }
    const order = await OrderModel.findByIdAndDelete(orderId).exec();
    if (!order) {
      throw errorObject(404, "Order not found");
    }
    return "Order deleted";
  }
}

module.exports = OrderService;
