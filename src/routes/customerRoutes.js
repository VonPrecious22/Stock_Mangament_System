const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controller/customerController");

router.post("/create", createCustomer);
router.get("/all", getAllCustomers);
router.get("/:id", getCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
