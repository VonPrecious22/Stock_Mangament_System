const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  renderCreateForm,
  renderEditForm,
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customerController");

// Create customer
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createCustomer);

// All customers
router.get("/", auth, getAllCustomers);

// One customer
router.get("/:id", auth, getCustomer);

// Edit customer
router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateCustomer);

// Delete customer
router.delete("/:id", auth, deleteCustomer);

module.exports = router;
