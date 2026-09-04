const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  quantityBought: {
    type: Number,
  },
  type: {
    type: String,
    enum: ["sale", "restock"],
    required: true,
  },
  notes: {
    type: String,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
