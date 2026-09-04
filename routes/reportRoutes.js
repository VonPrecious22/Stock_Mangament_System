const express = require("express");
const router = express.Router();
const { getFinancialSummary } = require("../controller/reportController");
const { requireAuth, requireRole } = require("../middleware/auth");

router.get(
  "/summary",
  requireAuth,
  requireRole("manager"),
  getFinancialSummary,
);

module.exports = router;
