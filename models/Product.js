const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const IMAGE_PATH = path.join("/uploads/image");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    season: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", IMAGE_PATH));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

productSchema.statics.uploadedImage = multer({ storage: storage }).single(
  "image"
);
productSchema.statics.imagePath = IMAGE_PATH;

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
