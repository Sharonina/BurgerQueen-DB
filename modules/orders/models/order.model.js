const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  client: { type: String, default: null, required: true },
  waiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
    required: true,
  },
  table: { type: Number, default: 0, required: true },
  products: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
    default: [],
    required: true,
  },
  status: { type: String, default: "pending", required: true },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    default: null,
    required: true,
  },
  date_entry: { type: Date, default: new Date(), required: true },
  date_processed: { type: Date, default: null },
});

orderSchema.index({ waiter: 1, restaurant: 1 });

module.exports = mongoose.model("order", orderSchema); //enviamos el schema como modelo
