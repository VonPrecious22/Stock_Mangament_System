const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");
const express = require("express");
const router = express.Router();

router.post("/create", createProduct);
router.get("/all", getAllProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
