'use client';

import React, { useEffect, useState } from 'react';
import JobCard from '@/components/JobCard';
import { Job } from '@/lib/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fallbackSeedJobs: Job[] = [
  // Keep your existing fallbackSeedJobs array here.
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

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
    isFeatured: false,
  });

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/jobs`);

      if (!response.ok) {
        throw new Error('Unable to fetch jobs');
      }

      const data = await response.json();

      setJobs(data);
    } catch (error) {
      console.warn(
        'Backend unavailable. Loading fallback jobs.',
        error
      );

      const backup = localStorage.getItem(
        'nearskill_synced_jobs'
      );

      if (backup) {
        setJobs(JSON.parse(backup));
      } else {
        setJobs(fallbackSeedJobs);

        localStorage.setItem(
          'nearskill_synced_jobs',
          JSON.stringify(fallbackSeedJobs)
        );
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id: string) {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      setJobs((prev) =>
        prev.filter((job) => job._id !== id)
      );
    } catch {
      const updated = jobs.filter(
        (job) => job._id !== id
      );

      setJobs(updated);

      localStorage.setItem(
        'nearskill_synced_jobs',
        JSON.stringify(updated)
      );
    }
  }

  async function handleCreatePost(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const payload = {
      ...newJob,
      _id: 'job_' + Date.now(),
      salaryMin: Number(newJob.salaryMin) || undefined,
      salaryMax: Number(newJob.salaryMax) || undefined,
      requirements: newJob.requirements
        .split('\n')
        .filter(Boolean),
      skills: newJob.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/jobs`,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const saved = await response.json();

      setJobs((prev) => [saved, ...prev]);
    } catch {
      const updated = [
        payload as unknown as Job,
        ...jobs,
      ];

      setJobs(updated);

      localStorage.setItem(
        'nearskill_synced_jobs',
        JSON.stringify(updated)
      );
    }

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
      isFeatured: false,
    });
  }

  const filteredJobs = jobs.filter((job) => {
    const categoryMatch =
      activeCategory === 'All' ||
      job.category === activeCategory;

    const searchMatch =
      job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.companyName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) =>
        skill
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

    return categoryMatch && searchMatch;
  });

  function formatSalary(
    value?: number
  ) {
    if (!value) return '';

    return `₹${(
      value / 100000
    ).toFixed(1)}L`;
  }

return (
  <div className="flex flex-col min-h-screen bg-slate-50">
    {/* Hero Banner */}
    <section className="bg-gradient-to-b from-indigo-50 via-white to-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-700">
            🚀 {jobs.length} Active Job Opportunities
          </span>

          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
            Find Your Next
            <span className="block text-indigo-600">
              Dream Tech Job
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Explore verified job opportunities from startups and enterprises.
            Search by company, technology, skills, location, or category.
          </p>

          {/* Search Box */}
          <div className="mt-10 mx-auto max-w-3xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, company, skills..."
                className="w-full rounded-full border border-slate-300 bg-white py-4 pl-6 pr-14 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                className="absolute right-2 top-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Search
              </button>
              </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm border">
              <p className="text-3xl font-bold text-indigo-600">
                {jobs.length}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Total Jobs
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border">
              <p className="text-3xl font-bold text-emerald-600">
                {jobs.filter((j) => j.isFeatured).length}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Featured Jobs
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border">
              <p className="text-3xl font-bold text-orange-600">
                {
                  new Set(
                    jobs.map((j) => j.companyName)
                  ).size
                }
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Companies
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm border">
              <p className="text-3xl font-bold text-purple-600">
                {
                  new Set(
                    jobs.map((j) => j.category)
                  ).size
                }
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Categories
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

        {/* Filters */}
    <section className="bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 py-6">

        <div className="flex flex-wrap gap-3">

          {[
            'All',
            'Development',
            'Design',
            'Marketing',
            'Data Science',
            'DevOps',
            'AI',
            'Product',
          ].map((category) => (

            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200
                ${
                  activeCategory === category
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              {category}
            </button>

          ))}

        </div>

      </div>
    </section>

    {/* Jobs */}

    <section className="flex-1 py-12">

      <div className="mx-auto max-w-7xl px-4">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-3xl font-bold text-slate-900">

              Latest Opportunities

            </h2>

            <p className="mt-2 text-slate-600">

              Showing {filteredJobs.length} jobs

            </p>

          </div>

        </div>

        {loading ? (

          <div className="grid gap-6">

            {[1,2,3,4].map((i)=>(
              <div
                key={i}
                className="h-40 rounded-xl bg-slate-200 animate-pulse"
              />
            ))}

          </div>

        ) : filteredJobs.length === 0 ? (

          <div className="rounded-xl border bg-white p-12 text-center">

            <h3 className="text-2xl font-bold">

              No Jobs Found

            </h3>

            <p className="mt-3 text-slate-500">

              Try changing your search keywords or category.

            </p>

          </div>

        ) : (

          <div className="grid gap-6">

            {filteredJobs.map((job) => (

              <JobCard
                key={job._id}
                job={job}
                onSelect={() => setSelectedJob(job)}
                onView={() => setSelectedJob(job)}
                onDelete={() => handleDeletePost(job._id)}
              />

            ))}

          </div>

        )}

      </div>

    </section>

    {/* Part 2C starts here */}
          {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between border-b px-8 py-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {selectedJob.title}
                </h2>

                <p className="mt-2 text-lg text-slate-600">
                  {selectedJob.companyName}
                </p>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border px-4 py-2 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-8 py-8">

              <div className="grid gap-8 md:grid-cols-2">

                <div>

                  <h3 className="mb-3 text-lg font-semibold">
                    Job Information
                  </h3>

                  <div className="space-y-3 text-slate-700">

                    <p>
                      <strong>Category:</strong>{" "}
                      {selectedJob.category}
                    </p>

                    <p>
                      <strong>Job Type:</strong>{" "}
                      {selectedJob.jobType}
                    </p>

                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedJob.location}
                    </p>

                    <p>
                      <strong>Work Mode:</strong>{" "}
                      {selectedJob.locationType}
                    </p>

                    <p>
                      <strong>Experience:</strong>{" "}
                      {selectedJob.experienceLevel}
                    </p>

                    <p>
                      <strong>Salary:</strong>{" "}
                      {formatSalary(selectedJob.salaryMin)}
                      {" - "}
                      {formatSalary(selectedJob.salaryMax)}
                    </p>

                  </div>

                  <h3 className="mt-8 mb-3 text-lg font-semibold">
                    Skills Required
                  </h3>

                  <div className="flex flex-wrap gap-2">

                    {selectedJob.skills.map((skill) => (

                      <span
                        key={skill}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700"
                      >
                        {skill}
                      </span>

                    ))}

                  </div>

                </div>

                <div>

                  <h3 className="mb-3 text-lg font-semibold">
                    Job Description
                  </h3>

                  <p className="leading-7 whitespace-pre-line text-slate-700">
                    {selectedJob.description}
                  </p>

                  <h3 className="mt-8 mb-3 text-lg font-semibold">
                    Requirements
                  </h3>

                  <ul className="list-disc space-y-2 pl-6">

                    {selectedJob.requirements.map(
                      (requirement, index) => (

                        <li key={index}>
                          {requirement}
                        </li>

                      )
                    )}

                  </ul>

                </div>

              </div>

            </div>

            <div className="flex justify-end gap-4 border-t px-8 py-6">

              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border px-6 py-3 hover:bg-slate-100"
              >
                Close
              </button>

              <a
                href={selectedJob.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Apply Now
              </a>

            </div>

          </div>
        </div>
      )}

      {/* Part 2D Starts Here */}
          {/* Call To Action */}
    <section className="bg-indigo-600">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">

        <h2 className="text-4xl font-bold text-white">
          Looking for Your Next Career Opportunity?
        </h2>

        <p className="mx-auto mt-4 max-w-3xl text-lg text-indigo-100">
          Join thousands of professionals discovering verified opportunities
          from startups, product companies, and enterprise organizations.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">

          <button
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="rounded-lg bg-white px-8 py-3 font-semibold text-indigo-600 hover:bg-slate-100 transition"
          >
            Browse Jobs
          </button>

          <a
            href="/register"
            className="rounded-lg border border-white px-8 py-3 font-semibold text-white hover:bg-white hover:text-indigo-600 transition"
          >
            Create Account
          </a>

        </div>

      </div>
    </section>

  </div>
);
}