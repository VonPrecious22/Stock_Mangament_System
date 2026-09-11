const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
  getAllTransactions,
  getTransaction,
} = require("../controller/transactionController");

router.get("/", auth, getAllTransactions);
router.get("/all", auth, getAllTransactions);
router.get("/:id", auth, getTransaction);

module.exports = router;
