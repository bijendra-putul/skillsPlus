require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log("------------------------------------------");
console.log("Checking JWT_SECRET value...");
console.log("Value found:", process.env.JWT_SECRET ? "✅ Loaded Successfully!" : "❌ UNDEFINED / EMPTY");
console.log("Raw Secret Key:", process.env.JWT_SECRET);
console.log("------------------------------------------");

if (!process.env.JWT_SECRET) {
    console.error("ERROR: Cannot proceed. Your .env file is not being read or JWT_SECRET is missing.");
    process.exit(1);
}

try {
    // Attempt to sign a temporary token
    const testPayload = { user: "diagnostic_test" };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '5m' });
    console.log("Token Generation: ✅ Success!");
    console.log("Generated Test Token:", token);
    
    // Attempt to verify the token right back
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token Verification: ✅ Success!");
    console.log("Decoded Data:", verified);
    console.log("\n🎉 Conclusion: Your JWT_SECRET is fully operational!");
} catch (error) {
    console.error("❌ JWT Operation Failed:", error.message);
}