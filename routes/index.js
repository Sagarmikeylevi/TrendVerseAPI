const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

router.get("/api/v1", homeController.home);

router.use("/api/v1/user", require("./user"));

console.log("Routes are running fine");
module.exports = router;
