import { Request, Response } from 'express';
import Job from '../models/Job';

export const getAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, locationType } = req.query;
    const filterQuery: any = {};

    if (category && category !== 'All') {
      filterQuery.category = category;
    }

    if (locationType) {
      filterQuery.locationType = locationType;
    }

    if (search) {
      const searchRegex = new RegExp(search as string, 'i');
      filterQuery.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { skills: { $in: [searchRegex] } }
      ];
    }

    const jobs = await Job.find(filterQuery).sort({ isFeatured: -1, createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to retrieve positions collection", error: error.message });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: "Job post details not found." });
      return;
    }
    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ message: "Database search failure", error: error.message });
  }
};

export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobData = req.body;
    
    // Auto convert comma lists into arrays
    if (typeof jobData.requirements === 'string') {
      jobData.requirements = jobData.requirements.split('\n').filter((r: string) => r.trim() !== '');
    }
    if (typeof jobData.skills === 'string') {
      jobData.skills = jobData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
    }

    const newJob = new Job(jobData);
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error: any) {
    res.status(400).json({ message: "Validation error while posting job.", error: error.message });
  }
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.id);
    if (!deletedJob) {
      res.status(404).json({ message: "Job listing not found" });
      return;
    }
    res.status(200).json({ message: "Job listings deleted successfully.", id: req.params.id });
  } catch (error: any) {
    res.status(500).json({ message: "Database deletion failed", error: error.message });
  }
};