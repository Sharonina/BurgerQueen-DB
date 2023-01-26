const mongoose = require("mongoose");

/* Command to run db mac: brew services start mongodb-community@6.0*/

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Conexión exitosa");
    })
    .catch((error) => {
      console.log("Error de conexión con la base de datos");
      console.log(error);
      process.exit(1);
    });
};
