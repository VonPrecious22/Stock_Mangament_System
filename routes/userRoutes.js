const express = require("express");
const { createUser } = require("../controller/userController");
const router = express.Router();
const { loginUser } = require("../controller/userLogin")
router.post("/register", createUser);
router.post("/login", loginUser);

module.exports = router;
