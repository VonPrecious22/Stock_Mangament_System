const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
  valuationMethod: {
    type: String,
    enum: ["FIFO", "LIFO"],
    default: "FIFO",
  },
  Product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  }
});

const stock = mongoose.model("stock", stockSchema);
module.exports = stock;





