const mongoose = require("mongoose");

const { detailedOrderAggregation } = require("../utils/aggregations.utils");
const { errorObject } = require("../../../utils/errors.utils");
const { isMongoIdValidation } = require("../../../utils/validation.utils");
const {
  toObject,
  toObjectId,
} = require("../../../utils/transformations.utils");

const UserService = require("../../users/services/user.service");
const RestaurantService = require("../../restaurants/services/restaurant.service");
const OrderModel = require("../models/order.model");

const restaurantService = new RestaurantService();
const userService = new UserService();

class OrderService {
  statuses = ["Pending", "Canceled", "Delivering", "Delivered"];
  constructor() {}

  // get all orders
  async getAllOrders(
    restaurant = null,
    limit = 10,
    page = 1,
    byCategory = false
  ) {
    isMongoIdValidation([restaurant._id]);

    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit and page must be numbers");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit and page must be greater than 1");
    }

    if (byCategory) {
      return await OrderModel.aggregate([
        {
          $match: {
            restaurant: mongoose.Types.ObjectId(restaurant._id),
            /* date_entry: {
              $gte: new Date(new Date().setHours(0, 0, 0)),
            }, */
          },
        },
        ...detailedOrderAggregation,
        {
          $group: {
            _id: "$status",
            orders: {
              $push: {
                _id: "$_id",
                client: "$client",
                waiter: "$waiter",
                status: "$status",
                products: "$products",
                restaurant: "$restaurant",
                date_entry: "$date_entry",
                date_processed: "$date_processed",
                table: "$table",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            orders: 1,
          },
        },
      ]);
    }

    const orderResponse = await OrderModel.aggregate([
      { $match: { restaurant: toObjectId(restaurant) } },
      { $skip: limit * (page - 1) },
      { $limit: Number(limit) },
      ...detailedOrderAggregation,
    ]);
    return orderResponse;
  }

  // get order by id
  async getOrderById(orderId) {
    isMongoIdValidation([orderId]);

    const orderResponse = await OrderModel.aggregate([
      { $match: { _id: toObjectId(orderId) } },
      ...detailedOrderAggregation,
    ]);
    return orderResponse;
  }

  // create order
  async createOrder(orderData) {
    // validate request
    const { client, waiter, products, restaurant, table } = orderData;
    if (!(client && waiter && products && restaurant && table)) {
      throw errorObject(400, "All input is required");
    }

    //check if products is an array
    if (!Array.isArray(products)) {
      throw errorObject(400, "Products must be an array");
    }

    // check if ids are valid
    isMongoIdValidation([waiter, ...products, restaurant]);

    const waiterExists = await userService.getUserById(waiter);
    if (!waiterExists) {
      throw errorObject(404, "Waiter not found");
    }

    // create order in db
    const order = await OrderModel.create({
      client,
      waiter,
      status: "Pending",
      products,
      restaurant,
      date_entry: new Date(),
      date_processed: null,
      table,
    });

    //return new order
    const newOrder = new OrderModel(order);
    const result = await newOrder.save();
    return await this.getOrderById(result._id);
  }

  // update order by id
  async updateOrderById(orderId, orderData) {
    const { restaurant, waiter, products } = orderData;

    const orderExist = await this.getOrderById(orderId);
    if (!orderExist) {
      throw errorObject(404, "Order not found");
    }

    if (products && !Array.isArray(products)) {
      throw errorObject(400, "Products must be an array");
    }

    const idsToValidate = products
      ? [orderId, waiter, ...products, restaurant]
      : [orderId, waiter, restaurant];
    isMongoIdValidation(idsToValidate.filter((id) => id !== undefined));

    if (waiter) {
      const waiterExists = await userService.getUserById(waiter);
      if (!waiterExists) {
        throw errorObject(404, "waiter not found");
      }
    }

    if (restaurant) {
      const restaurantExists = await restaurantService.getRestaurantById(
        restaurant
      );
      if (!restaurantExists) {
        throw errorObject(404, "restaurant not found");
      }
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { $set: orderData }, // para que no genere dobles
      { new: true } //para que retorne el obj nuevo y no el anterior
    ).exec();

    if (!order) {
      throw errorObject(404, "Order not found");
    }
    return await this.getOrderById(order._id);
  }

  // update order status
  async updateOrderStatusById(orderId, body) {
    const { status } = body;
    isMongoIdValidation([orderId]);

    // validate order existance
    const orderExist = await this.getOrderById(orderId);
    if (!orderExist) {
      throw errorObject(400, "Order not found");
    }

    //validate statuses
    if (!this.statuses.includes(status)) {
      throw errorObject(400, "Invalid status");
    }

    if (status === "Delivered") {
      return await OrderModel.findByIdAndUpdate(
        orderId,
        {
          status,
          date_processed: new Date(),
        },
        { new: true }
      );
    }

    const result = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return await this.getOrderById(result._id);
  }

  // delete order by id
  async deleteOrderById(orderId) {
    isMongoIdValidation([orderId]);
    const order = await OrderModel.findByIdAndDelete(orderId).exec();
    if (!order) {
      throw errorObject(404, "Order not found");
    }
    return "Order deleted";
  }
}

module.exports = OrderService;
