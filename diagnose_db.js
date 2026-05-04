const mongoose = require('mongoose');
require('dotenv').config();

async function runDiagnostics() {
    console.log("--- MONGODB DIAGNOSTICS ---");
    console.log("1. Checking Environment Variable...");
    if (!process.env.CONNECTION_STRING) {
        console.error("FAILED: CONNECTION_STRING is missing from .env");
        return;
    }
    console.log("OK: Connection string found.");

    console.log("\n2. Attempting to connect (Timeout: 10s)...");
    try {
        await mongoose.connect(process.env.CONNECTION_STRING, {
            serverSelectionTimeoutMS: 10000,
            family: 4 // Force IPv4
        });
        console.log("SUCCESS: Connected to MongoDB!");
        process.exit(0);
    } catch (err) {
        console.error("\nFAILED: Connection Error details:");
        console.error("- Name:", err.name);
        console.error("- Message:", err.message);
        if (err.reason) {
            console.error("- Reason:", JSON.stringify(err.reason, null, 2));
        }
        console.log("\n--- SUGGESTION ---");
        if (err.message.includes("ECONNREFUSED")) {
            console.log("Your DNS is blocking the SRV lookup. You MUST use the Direct Connection String.");
        } else if (err.message.includes("timed out")) {
            console.log("Your IP is likely blocked by Atlas or Port 27017 is blocked on your network.");
        }
        process.exit(1);
    }
}

runDiagnostics();
