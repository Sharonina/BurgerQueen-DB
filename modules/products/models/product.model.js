const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, default: null, required: true },
  price: { type: Number, default: 0, required: true },
  type: { type: String, default: null, required: true },
  image: { type: String, default: null, required: false },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    default: null,
  },
  date_entry: {
    type: Date,
    default: new Date(),
    required: true,
  },
});

productSchema.index({ name: 1, restaurant: 1 });

module.exports = mongoose.model("product", productSchema); //enviamos el schema como modelo
