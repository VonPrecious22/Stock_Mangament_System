const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    costPerUnit: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    valuationMethod: {
      type: String,
      enum: ["FIFO", "LIFO"],
      required: true,
      default: "FIFO",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
