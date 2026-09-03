const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stockNumber: {
    type: Number,
    required: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  valuationMethod: {
    type: String,
    enum: ["FIFO", "LIFO", null],
    default: "FIFO",
  },
});

const stock = mongoose.model("stock", stockSchema);
module.exports = stock;
