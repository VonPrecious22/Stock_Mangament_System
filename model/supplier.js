const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  supplyQuantity: {
    type: Number,
  },
  supplyPrice: {
    type: Number,
    required: true,
  },
  contact: {
    type: String,
  },
  address: {
    type: String,
  },
});

const Supplier = mongoose.model("Supplier", supplierSchema);
module.exports = Supplier;
