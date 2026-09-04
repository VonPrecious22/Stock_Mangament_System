const express = require("express");
const router = express.Router();
const {
  createSupplier,
  getSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controller/supplierController");

router.post("/create", createSupplier);
router.get("/all", getAllSuppliers);
router.get("/:id", getSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
