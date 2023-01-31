require("dotenv").config(); //expone las variables de entorno con process.env
const express = require("express"); //framework de node para bknd
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const { errorHandler } = require("./middleware/errorHandler");
require("./config/database").connect();
const routerApi = require("./router");

const app = express(); //instancia de express en app

const options = {
  swagerDefinition: {
    info: {
      title: "Burguer Queen",
      version: "1.0.0",
      description: "API for Burguer Queen by Sharonina",
    },
  },
  apis: [path.join(__dirname, "modules/*/routes/*.js")],
};
const swaggerSpecs = swaggerJsdoc(options);

app.use(express.json()); //middleware: transforma el json que mandamos para poder leerlo
routerApi(app);
app.use("/docs", swaggerUi.serve, swagger.setup(swaggerSpecs));
app.use(errorHandler);

module.exports = app;
