import mongoose from 'mongoose';
import Category from './models/Category';
import Product from './models/Product';
import Blog from './models/Blog';
import User from './models/User';
import Settings from './models/Settings';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
  {
    name: 'AI Tools',
    slug: 'ai-tools',
    description: 'Artificial Intelligence tools and software',
    icon: '🤖',
    productCount: 0,
  },
  {
    name: 'Software',
    slug: 'software',
    description: 'Productivity and development software',
    icon: '💻',
    productCount: 0,
  },
  {
    name: 'Courses',
    slug: 'courses',
    description: 'Online courses and learning platforms',
    icon: '📚',
    productCount: 0,
  },
  {
    name: 'Hosting',
    slug: 'hosting',
    description: 'Web hosting and cloud services',
    icon: '☁️',
    productCount: 0,
  },
  {
    name: 'Design Tools',
    slug: 'design-tools',
    description: 'Graphic design and creative tools',
    icon: '🎨',
    productCount: 0,
  },
  {
    name: 'Marketing',
    slug: 'marketing',
    description: 'Marketing and SEO tools',
    icon: '📈',
    productCount: 0,
  },
];

const products = [
  {
    title: 'ChatGPT Plus',
    slug: 'chatgpt-plus',
    description: 'Advanced AI assistant powered by GPT-4 for writing, coding, and more',
    features: [
      'Access to GPT-4 model',
      'Faster response times',
      'Priority access during peak hours',
      'Advanced data analysis capabilities',
      'Image input support',
    ],
    pros: ['Most powerful AI model available', 'Great for content creation', 'Reliable uptime', 'Multilingual support'],
    cons: ['Subscription cost of $20/month', 'Sometimes slow during peak hours', 'No internet access'],
    price: 20,
    discount: 0,
    rating: 4.8,
    reviewCount: 1250,
    images: ['https://placehold.co/600x400/3B82F6/FFFFFF?text=ChatGPT+Plus'],
    affiliateLink: 'https://chat.openai.com/plus',
    couponCode: '',
    category: 'ai-tools',
    tags: ['ai', 'chatbot', 'productivity', 'openai'],
    seo: {
      metaTitle: 'ChatGPT Plus - Advanced AI Assistant',
      metaDescription: 'Get access to GPT-4 with ChatGPT Plus. Perfect for content creation, coding, and more.',
      keywords: 'chatgpt, ai, gpt-4, chatbot, openai',
    },
  },
  {
    title: 'Notion Pro',
    slug: 'notion-pro',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases',
    features: [
      'Unlimited blocks and file uploads',
      'Advanced permissions and admin tools',
      'Version history for 30 days',
      'Team collaboration features',
      'Custom templates',
    ],
    pros: ['Highly customizable', 'Great for teams', 'Clean interface', 'All-in-one solution'],
    cons: ['Learning curve for beginners', 'Can be slow with large databases', 'Limited offline access'],
    price: 8,
    discount: 10,
    rating: 4.6,
    reviewCount: 890,
    images: ['https://placehold.co/600x400/8B5CF6/FFFFFF?text=Notion+Pro'],
    affiliateLink: 'https://www.notion.so/pro',
    couponCode: 'SAVE10',
    category: 'software',
    tags: ['productivity', 'notes', 'workspace', 'organization'],
    seo: {
      metaTitle: 'Notion Pro - All-in-One Workspace',
      metaDescription: 'Notion Pro is the ultimate workspace for teams and individuals.',
      keywords: 'notion, productivity, workspace, notes, organization',
    },
  },
  {
    title: 'Figma',
    slug: 'figma',
    description: 'Design and prototyping tool for UI/UX designers and teams',
    features: [
      'Real-time collaboration',
      'Cross-platform web-based tool',
      'Prototyping and interactive designs',
      'Design systems and components',
      'Developer handoff features',
    ],
    pros: ['Free for individuals', 'Excellent collaboration', 'Web-based no install needed', 'Extensive plugin ecosystem'],
    cons: ['Requires internet connection', 'Can be resource intensive', 'Limited offline capabilities'],
    price: 0,
    discount: 0,
    rating: 4.9,
    reviewCount: 2100,
    images: ['https://placehold.co/600x400/FF6B6B/FFFFFF?text=Figma'],
    affiliateLink: 'https://www.figma.com',
    couponCode: '',
    category: 'design-tools',
    tags: ['design', 'prototyping', 'collaboration', 'ui-ux'],
    seo: {
      metaTitle: 'Figma - Design and Prototyping Tool',
      metaDescription: 'Figma is the leading design and prototyping tool for teams.',
      keywords: 'figma, design, prototyping, ui-ux, design-tool',
    },
  },
  {
    title: 'GitHub Copilot',
    slug: 'github-copilot',
    description: 'AI pair programmer that helps you write code faster',
    features: [
      'AI-powered code suggestions',
      'Supports multiple programming languages',
      'Integrates with popular IDEs',
      'Context-aware recommendations',
      'Test generation',
    ],
    pros: ['Increases coding productivity', 'Learns from your codebase', 'Great for pair programming', 'Multi-language support'],
    cons: ['Subscription required', 'May suggest insecure code', 'Requires GitHub account'],
    price: 10,
    discount: 0,
    rating: 4.7,
    reviewCount: 750,
    images: ['https://placehold.co/600x400/10B981/FFFFFF?text=GitHub+Copilot'],
    affiliateLink: 'https://github.com/features/copilot',
    couponCode: '',
    category: 'ai-tools',
    tags: ['ai', 'coding', 'developer-tools', 'github'],
    seo: {
      metaTitle: 'GitHub Copilot - AI Pair Programmer',
      metaDescription: 'GitHub Copilot is an AI pair programmer that helps you write code faster.',
      keywords: 'github, copilot, ai, coding, developer-tools',
    },
  },
  {
    title: 'Vercel',
    slug: 'vercel',
    description: 'Platform for frontend frameworks and static sites',
    features: [
      'Instant deployments',
      'Global CDN',
      'Serverless functions',
      'Automatic HTTPS',
      'Git integration',
    ],
    pros: ['Excellent Next.js support', 'Fast deployments', 'Great developer experience', 'Free tier available'],
    cons: ['Limited backend capabilities', 'Can be expensive for large projects', 'Vendor lock-in'],
    price: 0,
    discount: 0,
    rating: 4.8,
    reviewCount: 1500,
    images: ['https://placehold.co/600x400/F97316/FFFFFF?text=Vercel'],
    affiliateLink: 'https://vercel.com',
    couponCode: '',
    category: 'hosting',
    tags: ['hosting', 'deployment', 'cdn', 'serverless'],
    seo: {
      metaTitle: 'Vercel - Frontend Deployment Platform',
      metaDescription: 'Vercel is the platform for frontend frameworks and static sites.',
      keywords: 'vercel, hosting, deployment, nextjs, cdn',
    },
  },
];

const blogs = [
  {
    title: 'Top 10 AI Tools for 2024',
    slug: 'top-10-ai-tools-2024',
    excerpt: 'Discover the best AI tools that will boost your productivity this year.',
    content: 'Full article content about AI tools...',
    readTime: 5,
    featuredImage: 'https://placehold.co/1200x600',
    category: 'ai-tools',
    tags: ['ai', 'tools', 'productivity'],
    isFeatured: true,
    author: {
      name: 'Admin',
      email: 'admin@nearskill.com',
    },
  },
  {
    title: 'How to Choose the Right Hosting Provider',
    slug: 'how-to-choose-hosting-provider',
    excerpt: 'A complete guide to selecting the perfect web hosting for your needs.',
    content: 'Full article content about hosting providers...',
    readTime: 8,
    featuredImage: 'https://placehold.co/1200x600',
    category: 'hosting',
    tags: ['hosting', 'web', 'guide'],
    isFeatured: true,
    author: {
      name: 'Admin',
      email: 'admin@nearskill.com',
    },
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nearskill');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await User.deleteMany({});
    await Settings.deleteMany({});

    // Seed categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Seeded ${createdCategories.length} categories`);

    // Seed products
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products`);

    // Update category product counts
    for (const category of createdCategories) {
      const count = await Product.countDocuments({ category: category.slug });
      await Category.findByIdAndUpdate(category._id, { productCount: count });
    }

    // Seed blogs
    const createdBlogs = await Blog.insertMany(blogs);
    console.log(`Seeded ${createdBlogs.length} blogs`);

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@nearskill.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Created admin user');

    // Create default settings
    await Settings.create({
      siteName: 'NearSkill',
      siteDescription: 'Discover the best products and tools',
      logo: '',
      favicon: '',
      socialLinks: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
      },
    });
    console.log('Created default settings');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();