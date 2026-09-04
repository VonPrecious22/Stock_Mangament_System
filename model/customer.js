const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantityBought: {
    type: Number,
    default: 0,
  },
  buyingPrice: {
    type: Number,
  },
});

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;
