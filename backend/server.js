// 1. MUST BE LINE 1: Load environment variables immediately
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nearskill')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// 4. Fallback checking for JWT_SECRET to prevent the crash
if (!process.env.JWT_SECRET) {
  console.error('CRITICAL WARNING: JWT_SECRET is not defined in your .env file!');
}

// 5. Routes (Adjust paths safely)
// If line 7 was failing with MODULE_NOT_FOUND, ensure this file exists or change to './src/routes/authRoutes'
try {
  // If you are compiling your TypeScript to a 'dist' or 'build' folder:
  const authRoutes = require('./dist/routes/authRoutes.js'); 
  app.use('/api/auth', authRoutes);

  const jobRoutes = require('./dist/routes/jobRoutes.js'); // check your exact filename (e.g., jobs.js or jobRoutes.js)
  app.use('/api/jobs', jobRoutes);
} catch (error) {
  // FALLBACK: If you want to use a tool like ts-node to run your typescript directly instead
  console.log("Routing warning: Ensure your TypeScript files are built/compiled or run via 'npm run dev'.");
}

// 6. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log('DEBUG: Is JWT_SECRET loaded? ->', process.env.JWT_SECRET ? "Yes" : "No");