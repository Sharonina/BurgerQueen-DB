const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, default: null, required: true },
});

restaurantSchema.index({ name: 1 });

module.exports = mongoose.model("restaurant", restaurantSchema); //enviamos el schema como modelo
