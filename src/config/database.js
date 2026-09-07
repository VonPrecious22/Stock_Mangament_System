const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
  const databaseUrl =
    process.env.MONGODB || "mongodb://localhost:27017/stockmanagement";
  try {
    await mongoose.connect(databaseUrl);
    console.log("Connected to the database");
  } catch (err) {
    console.error("Database failed to connect", err);
    process.exit(1);
  }
}`65rdkl`

// Export the function directly
module.exports = connectDatabase;
