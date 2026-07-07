import mongoose from 'mongoose';
import Job from './src/models/Job';
import dotenv from 'dotenv';
import path from 'path';

// Force load configuration settings from parent directories if initialized there
dotenv.config({ path: path.join(__dirname, '.env') });

const dummyJobs = [
  {
    title: "Senior AI / ML Engineer",
    companyName: "NeuralText AI",
    companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
    category: "AI & ML",
    jobType: "Full-time",
    locationType: "Remote",
    location: "Bengaluru, India (Remote)",
    salaryMin: 1800000,
    salaryMax: 3000000,
    salaryCurrency: "INR",
    experienceLevel: "Senior",
    applyUrl: "https://nearskill.in/apply/ai-engineer",
    description: "We are seeking a brilliant Senior AI Engineer to scale our Large Language Model fine-tuning pipelines, orchestration systems, and custom RAG architectures. You will collaborate directly with the product team to turn academic research into scalable client-facing production endpoints.",
    requirements: [
      "5+ years of production experience working with Python and PyTorch.",
      "Deep practical understanding of transformers, embeddings, and vector databases.",
      "Proven record deploying low-latency model serving frameworks to AWS or GCP."
    ],
    skills: ["Python", "PyTorch", "LLMs", "LangChain", "Vector DBs"],
    isFeatured: true
  },
  {
    title: "Operations Manager",
    companyName: "ScaleOps Global",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150",
    category: "Operations",
    jobType: "Full-time",
    locationType: "Hybrid",
    location: "Delhi NCR",
    salaryMin: 1200000,
    salaryMax: 1800000,
    salaryCurrency: "INR",
    experienceLevel: "Mid",
    applyUrl: "https://nearskill.in/apply/ops-manager",
    description: "Join our fast-growing logistics optimization team to streamline client onboarding, manage regional partner relationships, and structure cross-functional workflows across 3 major tech hubs. Great opportunity for a systematic problem solver.",
    requirements: [
      "3+ years experience in Tech Operations, Program Management, or Agile environments.",
      "Expert-level organization and setup using workspaces like Notion and Jira.",
      "Exceptional verbal and written communication skills across asynchronous structures."
    ],
    skills: ["Agile", "Jira", "Operations", "Project Management"],
    isFeatured: false
  },
  {
    title: "Full Stack Next.js Developer",
    companyName: "SaaSify Studio",
    companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=150",
    category: "Development",
    jobType: "Contract",
    locationType: "Remote",
    location: "Remote (Worldwide)",
    salaryMin: 1500000,
    salaryMax: 2500000,
    salaryCurrency: "INR",
    experienceLevel: "Mid",
    applyUrl: "https://nearskill.in/apply/nextjs-dev",
    description: "We are looking for an expert React/Next.js engineer to convert highly polished Figma wireframes into pixel-perfect, responsive Tailwind web screens. You'll structure clean API interactions using modern Next.js server actions.",
    requirements: [
      "Deep architectural knowledge of Next.js 14 App Router workflows.",
      "Mastery of Tailwind CSS layout styles and basic fluid animations (Framer Motion).",
      "Strong background integrating relational databases and REST endpoints."
    ],
    skills: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    isFeatured: true
  },
  {
    title: "Growth Marketing Lead",
    companyName: "FlowViral",
    companyLogo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150",
    category: "Marketing",
    jobType: "Full-time",
    locationType: "Remote",
    location: "Mumbai, India (Remote)",
    salaryMin: 1000000,
    salaryMax: 1600000,
    salaryCurrency: "INR",
    experienceLevel: "Senior",
    applyUrl: "https://nearskill.in/apply/growth-lead",
    description: "Take absolute ownership of our search acquisition metrics, organic traffic funnels, performance marketing assets, and community engagement schemes to 2x our daily active user base in under six months.",
    requirements: [
      "Demonstrated history scaling organic user acquisition for SaaS platforms or online job boards.",
      "Strong data analytical skillset utilizing Search Console, Semrush, and Segment.",
      "Excellent content strategy and compelling copy writing capabilities."
    ],
    skills: ["SEO", "Growth Hacking", "Google Analytics", "Copywriting"],
    isFeatured: false
  },
  {
    title: "UI/UX Product Designer",
    companyName: "PixelCraft",
    companyLogo: "https://images.unsplash.com/photo-1561070791-26c113006238?w=150",
    category: "Design",
    jobType: "Full-time",
    locationType: "Remote",
    location: "Remote",
    salaryMin: 900000,
    salaryMax: 1400000,
    salaryCurrency: "INR",
    experienceLevel: "Entry",
    applyUrl: "https://nearskill.in/apply/uiux-designer",
    description: "We are seeking a highly creative UI/UX designer to completely redesign how candidates browse, save, and apply for high-salary job opportunities. This role spans early wireframing through high-fidelity functional prototypes.",
    requirements: [
      "An exceptional visual design portfolio showcasing complex web application design systems.",
      "In-depth skills with Figma's advanced components, auto-layouts, and design tokens.",
      "Empathy-led approach backstopped by clear, documented user research studies."
    ],
    skills: ["Figma", "UI Design", "UX Research", "Wireframing"],
    isFeatured: false
  }
];

async function runSeeder() {
  try {
    const databaseUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nearskill';
    console.log(`Connecting to database at ${databaseUri}...`);
    
    await mongoose.connect(databaseUri);
    console.log("Database connection successful. Migrating product models into Job schemas...");

    // Clear legacy product artifacts and collections
    await Job.deleteMany({});
    console.log("Database collections cleared.");

    // Seed jobs
    await Job.insertMany(dummyJobs);
    console.log("Database seeded successfully with 5 curated job listings!");
    
    process.exit(0);
  } catch (error) {
    console.error("Critical database seeding failure: ", error);
    process.exit(1);
  }
}

runSeeder();