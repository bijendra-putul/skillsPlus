'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { Job } from '@/lib/types';

// High-fidelity fallback database backup in case backend connections are temporarily offline during initial testing
const fallbackSeedJobs: Job[] = [
  {
    _id: "job_01",
    title: "Senior AI / ML Engineer",
    companyName: "NeuralText AI",
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
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "job_02",
    title: "Operations Manager",
    companyName: "ScaleOps Global",
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
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "job_03",
    title: "Full Stack Next.js Developer",
    companyName: "SaaSify Studio",
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
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "job_04",
    title: "Growth Marketing Lead",
    companyName: "FlowViral",
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
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: "job_05",
    title: "UI/UX Product Designer",
    companyName: "PixelCraft",
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
    isFeatured: false,
    createdAt: new Date().toISOString()
  }
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<'candidate' | 'admin'>('candidate');
  const [loading, setLoading] = useState<boolean>(true);

  // Form states for publishing a new job listing
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: '',
    category: 'Development',
    jobType: 'Full-time' as const,
    locationType: 'Remote' as const,
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'INR',
    experienceLevel: 'Mid' as const,
    applyUrl: '',
    description: '',
    requirements: '',
    skills: '',
    isFeatured: false
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) throw new Error('API server unreachable');
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.warn('Unable to query Express backend. Defaulting to high-fidelity storage sandbox.');
        const backup = localStorage.getItem('nearskill_synced_jobs');
        if (backup) {
          setJobs(JSON.parse(backup));
        } else {
          setJobs(fallbackSeedJobs);
          localStorage.setItem('nearskill_synced_jobs', JSON.stringify(fallbackSeedJobs));
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobPayload = {
      ...newJob,
      _id: 'job_' + Date.now(),
      salaryMin: Number(newJob.salaryMin) || undefined,
      salaryMax: Number(newJob.salaryMax) || undefined,
      requirements: newJob.requirements.split('\n').filter(r => r.trim() !== ''),
      skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
      });
      if (!response.ok) throw new Error('Failed to register post on backend');
      
      const savedJob = await response.json();
      setJobs([savedJob, ...jobs]);
    } catch (err) {
      console.warn('Backend offline. Saving listing to local storage sandbox.');
      const updatedListings = [jobPayload as unknown as Job, ...jobs];
      setJobs(updatedListings);
      localStorage.setItem('nearskill_synced_jobs', JSON.stringify(updatedListings));
    }

    // Reset Form Input State
    setNewJob({
      title: '',
      companyName: '',
      category: 'Development',
      jobType: 'Full-time',
      locationType: 'Remote',
      location: '',
      salaryMin: '',
      salaryMax: '',
      salaryCurrency: 'INR',
      experienceLevel: 'Mid',
      applyUrl: '',
      description: '',
      requirements: '',
      skills: '',
      isFeatured: false
    });
    setViewMode('candidate');
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Deletion rejected by backend');
      const filtered = jobs.filter(j => j._id !== id);
      setJobs(filtered);
    } catch (err) {
      console.warn('Backend delete failed. Adjusting local state.');
      const filtered = jobs.filter(j => j._id !== id);
      setJobs(filtered);
      localStorage.setItem('nearskill_synced_jobs', JSON.stringify(filtered));
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesCategory = activeCategory === 'All' || job.category === activeCategory;
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatSalaryDescriptor = (val?: number) => {
    if (!val) return '';
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      {/* Mode Toggler Bar (Candidate Board vs. Admin Panel) */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          <span>🎯 SYSTEM ACCESS: LOCAL SANDBOX DISPATCHER</span>
          <div className="flex gap-4">
            <button 
              onClick={() => { setViewMode('candidate'); setSelectedJob(null); }}
              className={`hover:text-indigo-600 transition ${viewMode === 'candidate' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''}`}
            >
              Browse Jobs View
            </button>
            <button 
              onClick={() => { setViewMode('admin'); setSelectedJob(null); }}
              className={`hover:text-indigo-600 transition ${viewMode === 'admin' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : ''}`}
            >
              Admin Board Dashboard
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'candidate' ? (
        <div className="flex-1">
          {/* Hero Banner Section */}
          <div className="bg-gradient-to-b from-indigo-50/50 via-white to-white py-14 sm:py-20 border-b border-slate-100">
            <div className="mx-auto max-w-4xl text-center px-4 sm:px-6 lg:px-8">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
                🚀 Curating {jobs.length} High-Salary Tech & Business Opportunities
              </span>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Find your next remote <span className="text-indigo-600">tech career</span>
              </h1>
              <p className="mt-5 text-lg leading-8 text-slate-600 max-w-xl mx-auto">
                No tracking lists, no filler. Fully transparent remote, hybrid, and local roles with explicit salary bands.
              </p>

              {/* Central Search Bar */}
              <div className="mt-8 mx-auto max-w-xl relative rounded-full shadow-lg shadow-indigo-100/40">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search roles, tech skills, or company profiles..."
                  className="w-full rounded-full border border-slate-200 py-4 pl-6 pr-6 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories Pill Navigation Selector */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-wrap justify-center gap-3">
              {['All', 'AI & ML', 'Development', 'Operations', 'Marketing', 'Design'].map((cat) => {
                const isSelected = activeCategory === cat;
                const matchCount = cat === 'All' ? jobs.length : jobs.filter(j => j.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition shadow-sm ${
                      isSelected
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-600 ring-offset-2'
                        : 'bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200/80'
                    }`}
                  >
                    {cat === 'All' ? '🌐 All' : cat}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {matchCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Job Feed List Container */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center py-16">
                  <p className="text-slate-500 font-medium">Syncing database listings...</p>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} onSelect={setSelectedJob} />
                ))
              ) : (
                <div className="text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl">
                  <h3 className="font-semibold text-slate-700">No postings found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try tweaking your keywords or category filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Active Document Management List Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Active Listings</h2>
                </div>
                <div className="overflow-x-auto text-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 text-xs font-bold uppercase border-b">
                        <th className="px-6 py-3">Role Details</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{job.title}</p>
                            <p className="text-xs text-slate-500">{job.companyName} • {job.location}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                              {job.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeletePost(job._id)}
                              className="text-red-500 hover:text-red-700 font-semibold text-xs py-1 px-3 rounded-lg hover:bg-red-50 transition"
                            >
                              Delete Listing
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Create Job Posting Form Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Publish New Position</h2>
              <p className="text-xs text-slate-500 mb-6">Create a job board entry to update database documents.</p>

              <form onSubmit={handleCreatePost} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Role Title *</label>
                  <input 
                    type="text" required value={newJob.title} 
                    onChange={e => setNewJob({...newJob, title: e.target.value})} 
                    placeholder="e.g. Lead Next.js Architect" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Company Name *</label>
                  <input 
                    type="text" required value={newJob.companyName} 
                    onChange={e => setNewJob({...newJob, companyName: e.target.value})} 
                    placeholder="e.g. ScaleOps Global" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Category</label>
                    <select 
                      value={newJob.category} 
                      onChange={e => setNewJob({...newJob, category: e.target.value})} 
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option>Development</option>
                      <option>AI & ML</option>
                      <option>Operations</option>
                      <option>Marketing</option>
                      <option>Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location Type</label>
                    <select 
                      value={newJob.locationType} 
                      onChange={e => setNewJob({...newJob, locationType: e.target.value as any})} 
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option>Remote</option>
                      <option>Hybrid</option>
                      <option>Onsite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Location Details *</label>
                  <input 
                    type="text" required value={newJob.location} 
                    onChange={e => setNewJob({...newJob, location: e.target.value})} 
                    placeholder="e.g. Bengaluru, India (Remote)" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Min Salary (INR)</label>
                    <input 
                      type="number" value={newJob.salaryMin} 
                      onChange={e => setNewJob({...newJob, salaryMin: e.target.value})} 
                      placeholder="e.g. 1500000" 
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Max Salary (INR)</label>
                    <input 
                      type="number" value={newJob.salaryMax} 
                      onChange={e => setNewJob({...newJob, salaryMax: e.target.value})} 
                      placeholder="e.g. 2500000" 
                      className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">External Application URL *</label>
                  <input 
                    type="url" required value={newJob.applyUrl} 
                    onChange={e => setNewJob({...newJob, applyUrl: e.target.value})} 
                    placeholder="https://company.com/apply" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Skills (comma-separated)</label>
                  <input 
                    type="text" value={newJob.skills} 
                    onChange={e => setNewJob({...newJob, skills: e.target.value})} 
                    placeholder="React, Next.js, Tailwind, TypeScript" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Role Description *</label>
                  <textarea 
                    required rows={3} value={newJob.description} 
                    onChange={e => setNewJob({...newJob, description: e.target.value})} 
                    placeholder="Outline day-to-day duties and core focus areas..." 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Requirements (one per line)</label>
                  <textarea 
                    rows={2} value={newJob.requirements} 
                    onChange={e => setNewJob({...newJob, requirements: e.target.value})} 
                    placeholder="Requirement 1&#10;Requirement 2" 
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" id="isFeaturedCheck" checked={newJob.isFeatured} 
                    onChange={e => setNewJob({...newJob, isFeatured: e.target.checked})} 
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="isFeaturedCheck" className="text-xs font-semibold text-slate-700 uppercase cursor-pointer selection:bg-transparent">
                    Feature listing on homepage
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white uppercase tracking-wider transition"
                >
                  Post Job Listing
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {}
      {selectedJob && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop slide blur overlay click-to-close */}
            <div className="absolute inset-0 bg-slate-500/30 backdrop-blur-sm transition-opacity animate-fade-in" onClick={() => setSelectedJob(null)}></div>

            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-xl">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl border-l border-slate-200/50">
                  <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">Job Specifications</h2>
                    <button onClick={() => setSelectedJob(null)} className="rounded-md text-slate-400 hover:text-slate-600 focus:outline-none text-sm font-semibold">
                      Close ✕
                    </button>
                  </div>

                  <div className="flex-1 px-6 py-8 space-y-6">
                    <div>
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 mb-2">
                        {selectedJob.category}
                      </span>
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{selectedJob.title}</h1>
                      <p className="text-base font-semibold text-slate-500 mt-0.5">{selectedJob.companyName}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                        <span>📍 {selectedJob.locationType} ({selectedJob.location})</span>
                        <span>•</span>
                        <span>💼 {selectedJob.jobType}</span>
                        {(selectedJob.salaryMin || selectedJob.salaryMax) && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">💰 {formatSalaryDescriptor(selectedJob.salaryMin)} - {formatSalaryDescriptor(selectedJob.salaryMax)} / yr</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.skills.map((skill) => (
                          <span key={skill} className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Role Overview</h3>
                      <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{selectedJob.description}</p>
                    </div>

                    {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Core Requirements</h3>
                        <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm leading-relaxed">
                          {selectedJob.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 px-6 py-6 bg-slate-50 flex gap-3">
                    <a 
                      href={selectedJob.applyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 text-center rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm transition"
                    >
                      Apply Externally ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}