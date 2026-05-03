const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.CONNECTION_STRING) {
            throw new Error("CONNECTION_STRING is not defined in .env file");
        }
        await mongoose.connect(process.env.CONNECTION_STRING);
        console.log("MONGODB connected successfully");
    } catch (error) {
        console.error("=== MongoDB Connection Error ===");
        console.error("Message:", error.message);
        if (error.message.includes("timeout")) {
            console.error("Tip: Check if your IP is whitelisted in MongoDB Atlas or if the database server is running.");
        }
        process.exit(1);
    }
};

module.exports = connectDB;