const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    price: Number,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  contact: {
    type: Number,
    required: false,
  },
});

const supplier = mongoose.model('supplier', supplierSchema);
module.exports = supplier
