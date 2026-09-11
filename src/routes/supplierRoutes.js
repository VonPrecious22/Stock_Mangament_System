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

// Create supplier
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createSupplier);

// All suppliers
router.get("/", auth, getAllSuppliers);

// One supplier
router.get("/:id", auth, getSupplier);

// Edit supplier
router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateSupplier);

// Delete supplier
router.delete("/:id", auth, deleteSupplier);

module.exports = router;
