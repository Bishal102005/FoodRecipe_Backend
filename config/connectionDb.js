const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        // Do not use process.exit(1) in serverless environments
    }
};

module.exports = connectDB;