const express = require("express");
const router = express.Router();
const Product = require("../Models/Product");
const multer = require("multer");
const path = require("path");



// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Save with extension
  },
});

const upload = multer({ storage });

// POST: Add Product with Image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description,image } = req.body;
    //const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";
    
    const imagePath = req.file ? `uploads/${req.file.filename}` : "";
    const product = new Product({
      name,
      price,
      description,
      image:imagePath
    });
    await product.save();
    
    // const product = new Product({
    //   name,
    //   price,
    //   description,
    //   image: imagePath,
    // });

    // await product.save();
    console.log("product",product);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// GET: Fetch All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// PUT: Update Product (with optional new image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const updateData = { name, price, description };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating product" });
  }
});

// DELETE: Delete Product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
