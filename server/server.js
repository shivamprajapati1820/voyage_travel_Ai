require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas, then start listening.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Voyage server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
});

// Safety net for unhandled promise rejections (e.g. bad Mongo URI mid-run)
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});
