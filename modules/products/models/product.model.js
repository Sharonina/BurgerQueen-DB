const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  price: { type: Number, default: 0, required: true },
  type: { type: String, default: null, required: true },
  date_entry: { type: Date },
  // restaurrant: { type: mongoose.Schema.Types.ObjectId, ref:'restaurant'},
});

module.exports = mongoose.model("product", productSchema); //enviamos el schema como modelo
