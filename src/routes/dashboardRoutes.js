const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controller/dashboardController"); // ✅ destructured
const auth = require("../middleware/auth");

router.get("/dashboard", auth, getDashboard); // ✅ matches what login/register redirect to

module.exports = router;
