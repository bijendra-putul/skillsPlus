// backend/createAdmin.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name:      { type: String },
  email:     { type: String, unique: true, lowercase: true, trim: true },
  password:  { type: String },
  role:      { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

async function createAdmin() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/nearskill"
  );
  console.log("✅ Connected to MongoDB (nearskill)");

  // ── Change these values as needed ──
  const ADMIN_EMAIL    = "admin@jobportal.com";
  const ADMIN_PASSWORD = "Admin@123";
  const ADMIN_NAME     = "Super Admin";
  // ────────────────────────────────────

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const result = await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    {
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hashed,
      role:     "admin",
    },
    { upsert: true, new: true }
  );

  console.log("");
  console.log("🎉 Admin user inserted/updated successfully!");
  console.log("────────────────────────────────────────────");
  console.log("  Database : nearskill");
  console.log("  Name     :", result.name);
  console.log("  Email    :", result.email);
  console.log("  Password :", ADMIN_PASSWORD);
  console.log("  Role     :", result.role);
  console.log("  ID       :", result._id);
  console.log("────────────────────────────────────────────");

  await mongoose.disconnect();
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});