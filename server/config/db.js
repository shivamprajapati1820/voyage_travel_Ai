const mongoose = require("mongoose");

/**
 * Connects to MongoDB Atlas using the connection string in .env
 * Exits the process if connection fails so the app never runs
 * in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
