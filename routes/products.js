const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.post("/add", productController.add);
router.post("/update/:productId", productController.update);
router.delete("/delete/:productId", productController.delete);
router.get("/allProducts", productController.getAll);
router.get("/search", productController.search);

module.exports = router;
