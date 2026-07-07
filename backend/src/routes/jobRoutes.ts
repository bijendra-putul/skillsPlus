import express from 'express';
import { getAllJobs, getJobById, createJob, deleteJob } from '../controllers/jobController';

const router = express.Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', createJob);
router.delete('/:id', deleteJob);

export default router;