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

// Static routes must be declared before dynamic parameters (/:id)
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createProduct);
router.get("/", auth, getAllProduct);

// Parameterized routes
router.get("/:id", auth, getProduct);
router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
