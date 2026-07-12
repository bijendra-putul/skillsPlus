# NearSkill - Product Discovery Platform

A full-stack web application for discovering useful products, tools, software, courses, and AI tools through affiliate/referral links.

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI
- Framer Motion
- React Hook Form
- Zod
- Zustand
- TanStack Query

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- REST API
- Multer for image upload
- Nodemailer
- Helmet
- CORS
- Rate Limiter

## Project Structure

```
nearskill/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── categories/        # Category pages
│   ├── products/          # Product pages
│   ├── search/            # Search page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── privacy-policy/    # Privacy policy page
│   ├── terms-conditions/  # Terms page
│   ├── disclaimer/        # Disclaimer page
│   ├── affiliate-disclosure/ # Affiliate disclosure page
│   ├── faq/               # FAQ page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utility functions
│   ├── .env               # Environment variables
│   └── package.json
├── components/              # React components
│   ├── ui/                # Shadcn UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── Search.tsx
│   └── theme-provider.tsx
├── lib/                   # Shared utilities
│   ├── api.ts             # API service
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── .env.local             # Frontend environment variables
├── next.config.ts         # Next.js configuration
└── package.json
```

## Features

### Public Pages
- Home - Hero section, featured products, categories, blog posts
- Categories - Browse all product categories
- Products - Product listing with search, filter, and sort
- Product Details - Detailed product view with features, pros/cons, FAQs
- Blog - Blog listing with categories
- Blog Details - Blog post with comments
- About - About us page
- Contact - Contact form
- Privacy Policy - Legal page
- Terms & Conditions - Legal page
- Disclaimer - Legal page
- Affiliate Disclosure - Legal page
- Search - Global search functionality
- FAQ - Frequently asked questions

### User Features
- Register
- Login
- Forgot Password
- Reset Password
- User Profile
- Saved Products
- Recently Viewed
- Newsletter Subscription

### Admin Panel
- Dashboard
- Manage Categories
- Manage Products
- Manage Blogs
- Manage Referral Links
- Manage Users
- Analytics Dashboard
- Contact Messages
- Newsletter Subscribers
- SEO Settings
- Website Settings

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account or local MongoDB
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/nearskill.git
cd nearskill
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Backend (.env):
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nearskill
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3000/admin
```

5. Run the development servers

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Railway)
1. Create new web service
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user
- POST `/api/auth/forgot-password` - Forgot password
- PUT `/api/auth/reset-password/:token` - Reset password
- GET `/api/auth/me` - Get user profile
- PUT `/api/auth/me` - Update profile

### Products
- GET `/api/products` - Get all products
- GET `/api/products/featured` - Get featured products
- GET `/api/products/:slug` - Get single product
- GET `/api/products/click/:id` - Track affiliate click
- POST `/api/products` - Create product (Admin)
- PUT `/api/products/:id` - Update product (Admin)
- DELETE `/api/products/:id` - Delete product (Admin)

### Categories
- GET `/api/categories` - Get all categories
- GET `/api/categories/:slug` - Get single category
- POST `/api/categories` - Create category (Admin)
- PUT `/api/categories/:id` - Update category (Admin)
- DELETE `/api/categories/:id` - Delete category (Admin)

### Blogs
- GET `/api/blogs` - Get all blogs
- GET `/api/blogs/featured` - Get featured blogs
- GET `/api/blogs/:slug` - Get single blog
- POST `/api/blogs` - Create blog (Admin)
- PUT `/api/blogs/:id` - Update blog (Admin)
- DELETE `/api/blogs/:id` - Delete blog (Admin)
- POST `/api/blogs/:id/comments` - Add comment (Auth)

### Contact
- POST `/api/contact` - Submit contact form
- GET `/api/contact` - Get all messages (Admin)
- GET `/api/contact/:id` - Get single message (Admin)
- PUT `/api/contact/:id/reply` - Reply to message (Admin)
- DELETE `/api/contact/:id` - Delete message (Admin)

### Newsletter
- POST `/api/newsletter` - Subscribe
- PUT `/api/newsletter/unsubscribe` - Unsubscribe
- GET `/api/newsletter` - Get subscribers (Admin)
- DELETE `/api/newsletter/:id` - Delete subscriber (Admin)

### Analytics
- GET `/api/analytics/dashboard` - Get dashboard stats (Admin)
- GET `/api/analytics/products` - Get product analytics (Admin)
- GET `/api/analytics/clicks` - Get click history (Admin)

### Settings
- GET `/api/settings` - Get settings
- PUT `/api/settings` - Update settings (Admin)

## License

MIT License

# ── BACKEND ─────────────────────────────cd backendnpm install# Create .env (copy the values from step 2 above)# Then seed the admin user + categories:node scripts/seedAdmin.js# Start backendnpm run dev        # or: node index.js / node server.js# ── FRONTEND (new terminal) ──────────────cd frontendnpm install# Make sure .env.local has NEXT_PUBLIC_API_URL=http://localhost:5000npm run devShow more
# 🔐 Admin Credentials
# FieldValueURLhttp://localhost:3000/admin/loginEmailadmin@jobportal.comPasswordAdmin@123

# ✅ What You Get After Setup
# PageURLAdmin Loginhttp://localhost:3000/admin/loginAdmin Dashboardhttp://localhost:3000/adminManage Jobshttp://localhost:3000/admin/jobsManage Categorieshttp://localhost:3000/admin/categoriesManage Usershttp://localhost:3000/admin/users


# 💡 If login returns 404 on /api/auth/login — paste your backend routes/auth.js file and I'll fix the exact route path for you.