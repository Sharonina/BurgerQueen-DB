# Burger Queen API

Base de datos desarrollada en MongoDB y Express.js


## Users

- first_name: type: String,
- last_name: type: String,
- email: type: String, unique: true,
- password: type: String,
- role: type: String,
- admin: type: Boolean,
- restaurant: {name: String}

## Products


  price: { type: Number, default: 0, required: true },
  type: { type: String, default: null, required: true },
  image: { type: String, default: null, required: false },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurant",
    default: null,
  },
- name: type: String,
- price: type: Number,
- type: type: String,
- image: type: Url,
- restaurant: {ref: restaurant}

## Restaurants

- name: type: String
