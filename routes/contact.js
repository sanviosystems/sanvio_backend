// backend/routes/contact.js

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Assuming you have a Contact model for the data

router.post('/contact', async (req, res) => {
  try {
    const { name, contact, email, message } = req.body;

    // 🔍 Log request body for debugging
    console.log("Incoming contact data:", req.body);

    const newContact = new Contact({ name, contact, email, message });
    await newContact.save();

    res.status(200).json({ message: 'Contact message saved successfully' });
  } catch (error) {
    console.error("❌ Error saving contact message:", error); // 👈 ye line zaroor daalo
    res.status(500).json({ message: 'Failed to save message' });
  }
});



// Route to get all contact messages
router.get('/contact', async (req, res) => {
  try {
    const contacts = await Contact.find(); // Assuming `Contact` is your MongoDB model
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

module.exports = router;
