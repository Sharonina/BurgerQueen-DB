const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, default: null, required: true },
  last_name: { type: String, default: null, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  admin: { type: Boolean, default: false },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    default: null,
  },
});

userSchema.index({ email: 1 });

module.exports = mongoose.model("user", userSchema); //enviamos el schema como modelo
