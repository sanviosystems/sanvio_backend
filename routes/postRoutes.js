// routes/postRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../cloudinaryConfig');
const Post = require('../models/Post');

const router = express.Router();

// Multer storage for image upload to memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Image Upload Endpoint
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const { description, price } = req.body;
  
      // Validation
      if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
      if (!description) return res.status(400).json({ error: 'No description provided' });
      if (!price) return res.status(400).json({ error: 'No price provided' });
  
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
          }
  
          const imageUrl = result.secure_url;
  
          const newPost = new Post({
            description,
            price,
            imageUrl,
          });
  
          await newPost.save();
          res.status(201).json({ message: 'Product uploaded successfully', post: newPost });
        }
      ).end(req.file.buffer);
  
    } catch (err) {
      console.error('Error details:', err);
      res.status(500).json({ error: 'Error uploading product', details: err.message });
    }
  });
  
// GET all products (fetch products from MongoDB)
router.get('/products', async (req, res) => {
    try {
      const products = await Post.find();  // MongoDB se data fetch
      res.json(products);  // Send products as JSON response
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Error fetching products' });
    }
  });
// DELETE Route to delete a product by ID
router.delete("/delete/:id", async (req, res) => {
    const productId = req.params.id;
  
    try {
      const product = await Post.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Cloudinary se image ko delete karna
      const imagePublicId = product.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
  
      // MongoDB se product delete karna
      await Post.findByIdAndDelete(productId);
  
      res.status(200).json({ message: "Product and image deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });
  
  

module.exports = router;



