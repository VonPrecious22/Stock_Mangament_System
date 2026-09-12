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

router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createCustomer);

router.get("/", auth, getAllCustomers);

router.get("/:id", auth, getCustomer);

router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateCustomer);

router.delete("/:id", auth, deleteCustomer);

module.exports = router;
