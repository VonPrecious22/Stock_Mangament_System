const express = require("express");
const router = express.Router();
const { getFinancialSummary } = require("../controller/reportController");
const auth = require("../middleware/auth");

router.get("/", auth, getFinancialSummary);

module.exports = router;
