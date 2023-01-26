require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
