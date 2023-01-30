const userRouter = require("./modules/users/routes/users.route");
const productRouter = require("./modules/products/routes/products.route");
/* const orderRouter = require("./modules/orders/routes/order.route"); */

function routerApi(app) {
  app.use("/users", userRouter);
  app.use("/products", productRouter);
  /* app.use("/orders", orderRouter); */
}

module.exports = routerApi;
