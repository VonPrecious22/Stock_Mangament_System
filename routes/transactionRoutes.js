const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController");

router.post("/create", createTransaction);
router.get("/all", getAllTransactions);
router.get("/:id", getTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
