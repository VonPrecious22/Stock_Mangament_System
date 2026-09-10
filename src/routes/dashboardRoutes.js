const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controller/dashboardController"); 
const auth = require("../middleware/auth");

router.get("/dashboard", auth, getDashboard); 

module.exports = router;
