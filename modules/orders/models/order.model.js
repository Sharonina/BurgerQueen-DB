const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  client: { type: String, default: null, required: true },
  waitres: { type: String, default: null, required: true },
  products: { type: Array, default: [], required: true },
  status: { type: String, default: "pending", required: true },
  date_entry: { type: Date, default: new Date(), required: true },
  date_processed: { type: Date, default: null },
  // restaurant: { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
});

module.exports = mongoose.model("order", orderSchema); //enviamos el schema como modelo
