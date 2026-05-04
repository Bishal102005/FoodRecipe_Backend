const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const uri = process.env.CONNECTION_STRING;
        console.log("Connecting to MongoDB with URI starting with:", uri?.substring(0, 30));

        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
        });

        console.log("MONGODB connected successfully");
    } catch (error) {
        console.error("CONNECTION ERROR:");
        console.error("Message:", error.message);
    }
};

module.exports = connectDB;