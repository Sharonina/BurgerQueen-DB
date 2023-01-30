const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  client: { type: String, default: null, required: true },
  waitres: { type: String, default: null, required: true },
  products: { type: Array, default: [], required: true },
  products_quantity: { type: Number, default: 1, required: true },
  status: { type: String, default: null, required: true },
  date_entry: { type: Date },
  date_processed: { type: Date },
  // restaurrant: { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
});

module.exports = mongoose.model("orden", orderSchema); //enviamos el schema como modelo
