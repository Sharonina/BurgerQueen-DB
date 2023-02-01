const OrderModel = require("../models/order.model");

class OrderService {
  constructor() {}

  async getAllOrders(restaurant, limit = 10, page = 1) {
    return await OrderModel.find({ restaurant })
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
  }

  async getOrderById(orderId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }
    return await OrderModel.findById();
  }
}

module.exports = OrderService;
