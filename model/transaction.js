const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["IN", "OUT", null],
    required: true,
  },
  note: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  quantity_Bought: {
    type: Number,
    required: true,
  },
});

const transaction = mongoose.model("transaction", transactionSchema);
module.exports = transaction;
