const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: false,
  },
  contact: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
});

const manager = mongoose.model("manager", managerSchema);
module.exports = manager;
