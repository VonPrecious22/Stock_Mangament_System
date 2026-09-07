const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  renderCreateForm,
  createTransaction,
  getTransaction,
  getAllTransactions,
  renderEditForm,
  updateTransaction,
  deleteTransaction,
} = require("../controller/transactionController");

router.get("/create", auth, renderCreateForm);
router.post("/create", auth, createTransaction);
router.get("/", auth, getAllTransactions);

router.get("/:id/edit", auth, renderEditForm);
router.get("/:id", auth, getTransaction);
router.put("/:id", auth, updateTransaction);
router.delete("/:id", auth, deleteTransaction);

module.exports = router;
