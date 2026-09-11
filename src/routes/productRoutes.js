const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {
  renderCreateForm,
  createProduct,
  getAllProduct,
  getProduct,
  renderEditForm,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

// Create product
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createProduct);

// All products
router.get("/", auth, getAllProduct);

// One product
router.get("/:id", auth, getProduct);

// Edit product
router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateProduct);

// Delete product
router.delete("/:id", auth, deleteProduct);

module.exports = router;
