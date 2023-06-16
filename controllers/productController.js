const Product = require("../models/Product");
const fs = require("fs");

module.exports.add = async (req, res) => {
  try {
    Product.uploadedImage(req, res, async (err) => {
      if (req.body.adminID !== "admin@21") {
        return res.status(401).json({ error: "Unauthorized Access" });
      }
      if (err) {
        console.log(`*****Multer Error: ${err}`);
        return res.status(500).json({ error: "Image upload failed." });
      }

      // Extract data from req.body
      const { name, price, type, brand, gender, colors, quantity, season } =
        req.body;

      // Retrieve the file path of the uploaded image
      const imagePath = req.file.path;

      // Create a new product instance
      const newProduct = new Product({
        name,
        image: imagePath,
        price,
        type,
        brand,
        gender,
        colors,
        quantity,
        season,
      });

      // Save the new product to the database
      await newProduct.save();

      // Respond with a success message
      res.status(200).json({
        message: "Product added successfully.",
        data: {
          product: newProduct,
        },
      });
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product." });
  }
};

module.exports.update = async (req, res) => {
  try {
    Product.uploadedImage(req, res, async (err) => {
      console.log(req.body);
      if (err) {
        console.log(`*****Multer Error: ${err}`);
        return res.status(500).json({ error: "Image upload failed." });
      }
      const { productId } = req.params;
      const { name, price, type, brand, gender, colors, quantity, season } =
        req.body;

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }

      // Update the product properties
      product.name = name;
      product.price = price;
      product.type = type;
      product.brand = brand;
      product.gender = gender;
      product.colors = colors;
      product.quantity = quantity;
      product.season = season;

      if (req.file) {
        // If a new image is uploaded, update the image path
        const imagePath = req.file.path;

        // Delete the previous image file
        if (product.image) {
          fs.unlinkSync(product.image);
        }

        product.image = imagePath;
      }

      // Save the updated product
      await product.save();

      res.status(200).json({ message: "Product updated successfully." });
    });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product." });
  }
};

module.exports.delete = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID in the database
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Delete the product image file
    if (product.image) {
      fs.unlinkSync(product.image);
    }

    // Delete the product from the database
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product." });
  }
};

module.exports.getAll = async (req, res) => {
  try {
    // Retrieve all products from the database
    const products = await Product.find();

    res.status(200).json({ data: { products } });
  } catch (error) {
    console.log(`*****Error: ${error}`);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the products." });
  }
};

module.exports.search = async (req, res) => {
  const { keyword } = req.query;

  const products = await Product.find();

  const lowerCaseKeyword = keyword.toLowerCase(); // Convert the keyword to lowercase

  const searchResults = products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerCaseKeyword) ||
      product.type.toLowerCase().includes(lowerCaseKeyword) ||
      product.brand.toLowerCase().includes(lowerCaseKeyword) ||
      product.season.toLowerCase().includes(lowerCaseKeyword)
  );

  res.status(200).json({ data: { searchResults } });
};

