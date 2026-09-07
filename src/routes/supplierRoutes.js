const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  renderCreateForm,
  createSupplier,
  getSupplier,
  getAllSuppliers,
  renderEditForm,
  updateSupplier,
  deleteSupplier,
} = require("../controller/supplierController");

// Static routes must precede dynamic parameters
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createSupplier);
router.get("/", auth, getAllSuppliers);

// Parameterized routes
router.get("/:id/edit", auth, renderEditForm);
router.get("/:id", auth, getSupplier);
router.put("/:id", auth, updateSupplier);
router.delete("/:id", auth, deleteSupplier);

module.exports = router;
