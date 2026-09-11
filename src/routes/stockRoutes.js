const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  renderCreateForm,
  renderEditForm,
  getStock,
  createStock,
  sellProduct,
  getAllStocks,
  updateStock,
  deleteStock,
} = require("../controller/stockController");

router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createStock);

router.get("/", auth, getAllStocks);
router.get("/all", auth, getAllStocks);

router.post("/:productId/sell", auth, sellProduct);

router.get("/:id/edit", auth, renderEditForm);
router.put("/:id", auth, updateStock);

router.get("/:id", auth, getStock);
router.delete("/:id", auth, deleteStock);

module.exports = router;
