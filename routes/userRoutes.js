const express = require("express");
const { createUser, getUser } = require("../controller/userController");
const router = express.Router();
const { loginUser } = require("../controller/userLogin")
router.post("/register", createUser);
router.post("/login", loginUser);
// app.get('/me', getUser);

module.exports = router;
