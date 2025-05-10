const express = require("express"); // Only one 'express' import
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Importing Routes
const postRoutes = require("./routes/postRoutes");
const contactRoutes = require("./routes/contact");


dotenv.config();  // Load environment variables from the .env file

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // For parsing incoming JSON requests

// Routes
app.use("/api", postRoutes);  // Existing post routes
app.use('/api', contactRoutes);  // Existing contact routes


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error", err));

// Start the server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
