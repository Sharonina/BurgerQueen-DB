const userRouter = require("./modules/users/routes/users.route");

function routerApi(app) {
  app.use("/users", userRouter);
}

module.exports = routerApi;
