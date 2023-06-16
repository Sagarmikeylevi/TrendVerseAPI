const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

router.get("/api/v1", homeController.home);

router.use("/api/v1/user", require("./user"));
router.use("/api/v1/product", require("./products"));

console.log("Routes are running fine");
module.exports = router;
