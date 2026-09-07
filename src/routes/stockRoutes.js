const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  renderCreateForm,
  renderEditForm,
  getStock,
  createStock,
  getAllStocks,
  updateStock,
  deleteStock,
} = require("../controller/stockController");

// Static routes must come before dynamic parameters (/:id)
router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createStock);
router.get("/", auth, getAllStocks);

// Parameterized routes
router.get("/:id/edit", auth, renderEditForm);
router.get("/:id", auth, getStock);
router.put("/:id", auth, updateStock);
router.delete("/:id", auth, deleteStock);

module.exports = router;
