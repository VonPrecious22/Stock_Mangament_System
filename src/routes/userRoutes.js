const express = require("express");
const { createUser, getUser, renderRegisterForm} = require("../controller/userController");
const router = express.Router();
const { showLogin, login, logOut } = require("../controller/userLogin");
const auth = require('../middleware/auth')
router.post("/register", createUser);
router.get("/register", renderRegisterForm);
router.post("/logOut", logOut);
router.get('/login', showLogin);
router.post('/login', login);  
router.get("/me", auth, getUser); 

module.exports = router;

