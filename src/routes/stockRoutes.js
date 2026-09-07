const express = require("express");
const router = express.Router();
const {
    getStock,
  createStock,
  getAllStocks,
  updateStock,
  deleteStock,
} = require("../controller/stockController");
router.get("/all", getAllStocks);
router.post("/create", createStock);
router.get("/:id", deleteStock);
router.get("/:id", getStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

module.exports = router;
