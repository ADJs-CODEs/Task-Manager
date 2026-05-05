const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MongoDB Error: MONGO_URI is not defined in .env");
    process.exit(1);
  }

  try {
    mongoose.connection.on("connected", () => console.log("Database Connected"));
    mongoose.connection.on("error", (err) => console.error(`MongoDB error: ${err.message}`));
    mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected. Reconnecting..."));

    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

module.exports = connectDB;