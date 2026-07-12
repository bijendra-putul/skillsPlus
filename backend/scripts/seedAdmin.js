// backend/scripts/seedAdmin.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
require("dotenv").config();

// ── User Model ────────────────────────────────────────────────────
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ── Category Model ────────────────────────────────────────────────
const categorySchema = new mongoose.Schema({
  name:     { type: String, required: true, unique: true },
  slug:     { type: String, required: true, unique: true },
  icon:     { type: String, default: "💼" },
  isActive: { type: Boolean, default: true },
  createdAt:{ type: Date, default: Date.now },
});
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

// ── Seed Function ─────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(
    process.env.MONGO_URI || "mongodb://localhost:27017/nearskill"
  );
  console.log("✅ Connected to MongoDB");

  // ── Create / update admin user ──
  const hashed = await bcrypt.hash("Admin@123", 10);

  const existing = await User.findOne({ email: "admin@jobportal.com" });
  if (!existing) {
    await User.create({
      name:     "Super Admin",
      email:    "admin@jobportal.com",
      password: hashed,
      role:     "admin",
    });
    console.log("✅ Admin user created");
  } else {
    // Update password and role in case they changed
    await User.updateOne(
      { email: "admin@jobportal.com" },
      { $set: { password: hashed, role: "admin" } }
    );
    console.log("✅ Admin user updated");
  }

  // ── Seed categories ──
  const categories = [
    { name: "Technology",      slug: "technology",      icon: "💻" },
    { name: "Marketing",       slug: "marketing",       icon: "📣" },
    { name: "Design",          slug: "design",          icon: "🎨" },
    { name: "Finance",         slug: "finance",         icon: "💰" },
    { name: "Healthcare",      slug: "healthcare",      icon: "🏥" },
    { name: "Education",       slug: "education",       icon: "📚" },
    { name: "Sales",           slug: "sales",           icon: "🤝" },
    { name: "Human Resources", slug: "human-resources", icon: "👥" },
  ];

  for (const cat of categories) {
    await Category.findOneAndUpdate(
      { slug: cat.slug },
      { ...cat },
      { upsert: true, new: true }
    );
  }
  console.log("✅ Categories seeded");

  await mongoose.disconnect();

  console.log("");
  console.log("🎉 Seed complete!");
  console.log("──────────────────────────────");
  console.log("  Email:    admin@jobportal.com");
  console.log("  Password: Admin@123");
  console.log("──────────────────────────────");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});