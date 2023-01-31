const userRouter = require("./modules/users/routes/users.route");
const productRouter = require("./modules/products/routes/products.route");
const orderRouter = require("./modules/orders/routes/orders.route");
const restaurantRouter = require("./modules/restaurants/routes/restaurants.route");

function routerApi(app) {
  app.use("/users", userRouter);
  app.use("/products", productRouter);
  app.use("/orders", orderRouter);
  app.use("/restaurants", restaurantRouter);
}

module.exports = routerApi;
