import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  companyName: string;
  companyLogo?: string;
  category: string; // e.g., 'AI & ML', 'Operations', 'Development', 'Marketing', 'Design'
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  locationType: 'Remote' | 'Hybrid' | 'Onsite';
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string; // Default: 'INR'
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  applyUrl: string;
  description: string;
  requirements: string[];
  skills: string[];
  isFeatured: boolean;
  createdAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    companyLogo: { type: String, default: '' },
    category: { type: String, required: true, index: true },
    jobType: { 
      type: String, 
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], 
      required: true 
    },
    locationType: { 
      type: String, 
      enum: ['Remote', 'Hybrid', 'Onsite'], 
      required: true 
    },
    location: { type: String, required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    salaryCurrency: { type: String, default: 'INR' },
    experienceLevel: { 
      type: String, 
      enum: ['Entry', 'Mid', 'Senior', 'Lead'], 
      required: true 
    },
    applyUrl: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [], index: true },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);