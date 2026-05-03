const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        // Disable buffering so it fails fast instead of hanging
        mongoose.set('bufferCommands', false);
        
        await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
        });
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
    }
};

module.exports = connectDB;