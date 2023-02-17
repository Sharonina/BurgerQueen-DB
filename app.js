require("dotenv").config(); //expone las variables de entorno con process.env
const express = require("express"); //framework de node para bknd
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");

require("./config/database").connect();
const routerApi = require("./router");

const app = express(); //instancia de express en app
app.use(cors());
app.use(express.json()); //middleware: transforma el json que mandamos para poder leerlo
routerApi(app);
app.use(errorHandler);

module.exports = app;
