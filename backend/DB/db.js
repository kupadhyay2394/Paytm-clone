const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    
    await mongoose.connect('mongodb+srv://kupadhyay2394:krishna123@cluster0.6tp8w.mongodb.net/');
    console.log("✅ Connected to MongoDB successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
};

module.exports = connectDB;