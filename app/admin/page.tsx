// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardCards from "./components/DashboardCards";

interface RecentJob {
  _id: string;
  title: string;
  company: string;
  companyName?: string;
  jobType?: string;
  createdAt: string;
  isActive?: boolean;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  companyName: string;
  jobType: string;
  locationType: string;
  location: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  isFeatured: boolean;
  description: string;
  requirements: string[];
  skills: string[];
  applyUrl: string;
  category: string;
  createdAt: string;
  isActive?: boolean;
}

interface NewJobForm {
  title: string;
  companyName: string;
  location: string;
  locationType: "Remote" | "Hybrid" | "Onsite";
  jobType: "Full-time" | "Part-time" | "Contract" | "Internship";
  applyUrl: string;
  description: string;
  requirements: string;
  skills: string;
  isFeatured: boolean;
}

const defaultNewJob: NewJobForm = {
  title: "",
  companyName: "",
  location: "",
  locationType: "Remote",
  jobType: "Full-time",
  applyUrl: "",
  description: "",
  requirements: "",
  skills: "",
  isFeatured: false,
};

export default function AdminDashboard() {
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newJob, setNewJob] = useState<NewJobForm>(defaultNewJob);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);

  useEffect(() => {
    const name = localStorage.getItem("name") || "Admin";
    setAdminName(name);

    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=5&sort=-createdAt`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const jobs: RecentJob[] = data.jobs ?? data ?? [];
        setRecentJobs(jobs.slice(0, 5));
      })
      .catch(() => setRecentJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const jobTypeBadge = (type?: string) => {
    const map: Record<string, string> = {
      "Full-time": "bg-emerald-500/10 text-emerald-400",
      "Part-time": "bg-amber-500/10 text-amber-400",
      Remote: "bg-indigo-500/10 text-indigo-400",
      Internship: "bg-violet-500/10 text-violet-400",
      Contract: "bg-rose-500/10 text-rose-400",
    };
    const cls = map[type ?? ""] ?? "bg-slate-500/10 text-slate-400";
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>
        {type ?? "N/A"}
      </span>
    );
  };

  const deleteJob = async (id: string) => {
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRecentJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const body = {
      ...newJob,
      requirements: newJob.requirements.split("\n").filter(Boolean),
      skills: newJob.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setShowCreateModal(false);
      setNewJob(defaultNewJob);
      // Refresh recent jobs
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs?limit=5&sort=-createdAt`,
        { headers: { Authorization: `Bearer ${token}` } }
      ).then((r) => r.json());
      setRecentJobs((data.jobs ?? data ?? []).slice(0, 5));
    }
  };

  const handleUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJob) return;
    const token = localStorage.getItem("token");
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${editJob._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editJob),
    });
    setIsEditing(false);
    setEditJob(null);
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back, {adminName}
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Here is what is happening with your job portal today.
          </p>
        </div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Post New Job
        </Link>
      </div>

      {/* Stats */}
      <DashboardCards />

      {/* Quick Actions */}
      <div>
        <h3 className="text-white font-semibold text-base mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Manage Jobs",
              href: "/admin/jobs",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              ),
              color: "indigo",
            },
            {
              label: "Manage Users",
              href: "/admin/users",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              color: "violet",
            },
            {
              label: "Categories",
              href: "/admin/categories",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                </svg>
              ),
              color: "emerald",
            },
            {
              label: "Settings",
              href: "/admin/settings",
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
              color: "amber",
            },
          ].map((action) => {
            const colorMap: Record<string, string> = {
              indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
              violet: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
              emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20",
              amber: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
            };
            return (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-150 text-center ${colorMap[action.color]}`}
              >
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">Recent Jobs</h3>
          <Link href="/admin/jobs" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            View all
          </Link>
        </div>

        <div className="bg-[#13151f] border border-white/5 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="divide-y divide-white/5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="w-40 h-4 rounded bg-white/5" />
                    <div className="w-24 h-3 rounded bg-white/5" />
                  </div>
                  <div className="w-16 h-5 rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                </svg>
              </div>
              <p className="text-slate-400 font-medium">No jobs posted yet</p>
              <p className="text-slate-600 text-sm mt-1">Post your first job to get started</p>
              <Link href="/admin/jobs" className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                Go to Jobs
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-300 text-sm font-semibold uppercase">
                      {job.company?.charAt(0) ?? "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{job.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5 truncate">
                      {job.company} &middot; {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {jobTypeBadge(job.jobType)}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.isActive !== false
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {job.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================== Create Job Modal ========================== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-8 py-6">
              <h2 className="text-2xl font-bold">Post New Job</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border px-4 py-2 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateJob}
              className="max-h-[80vh] overflow-y-auto p-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                {/* Company */}
                <div>
                  <label className="mb-2 block font-medium">Company</label>
                  <input
                    type="text"
                    value={newJob.companyName}
                    onChange={(e) => setNewJob({ ...newJob, companyName: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="mb-2 block font-medium">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Work Mode */}
                <div>
                  <label className="mb-2 block font-medium">Work Mode</label>
                  <select
                    value={newJob.locationType}
                    onChange={(e) => setNewJob({ ...newJob, locationType: e.target.value as NewJobForm["locationType"] })}
                    className="w-full rounded-lg border p-3"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>Onsite</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="mb-2 block font-medium">Job Type</label>
                  <select
                    value={newJob.jobType}
                    onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value as NewJobForm["jobType"] })}
                    className="w-full rounded-lg border p-3"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>

                {/* Apply URL */}
                <div>
                  <label className="mb-2 block font-medium">Apply URL</label>
                  <input
                    type="url"
                    value={newJob.applyUrl}
                    onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium">Job Description</label>
                  <textarea
                    rows={6}
                    required
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Requirements */}
                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium">Requirements</label>
                  <textarea
                    rows={5}
                    placeholder="One requirement per line"
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Skills */}
                <div className="md:col-span-2">
                  <label className="mb-2 block font-medium">Skills</label>
                  <input
                    type="text"
                    placeholder="React, Node.js, MongoDB"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                    className="w-full rounded-lg border p-3"
                  />
                </div>

                {/* Featured */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={newJob.isFeatured}
                      onChange={(e) => setNewJob({ ...newJob, isFeatured: e.target.checked })}
                    />
                    <span className="font-medium">Featured Job</span>
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border px-6 py-3 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
                >
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================== View Job Modal ========================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-8 py-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{selectedJob.title}</h2>
                <p className="mt-1 text-slate-500">{selectedJob.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border px-4 py-2 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto p-8">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-xl font-semibold">Job Information</h3>
                  <div className="space-y-3">
                    <p><strong>Category:</strong> {selectedJob.category}</p>
                    <p><strong>Company:</strong> {selectedJob.companyName}</p>
                    <p><strong>Job Type:</strong> {selectedJob.jobType}</p>
                    <p><strong>Location:</strong> {selectedJob.location}</p>
                    <p><strong>Work Mode:</strong> {selectedJob.locationType}</p>
                    <p><strong>Experience:</strong> {selectedJob.experienceLevel}</p>
                    <p>
                      <strong>Salary:</strong> ₹{selectedJob.salaryMin?.toLocaleString()} –
                      ₹{selectedJob.salaryMax?.toLocaleString()}
                    </p>
                    <p><strong>Featured:</strong> {selectedJob.isFeatured ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-semibold">Description</h3>
                  <p className="whitespace-pre-line leading-7 text-slate-700">{selectedJob.description}</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-xl font-semibold">Requirements</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {selectedJob.requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <h3 className="mb-4 text-xl font-semibold">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-indigo-100 px-3 py-2 text-sm text-indigo-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 border-t px-8 py-6">
              <button
                onClick={() => setSelectedJob(null)}
                className="rounded-lg border px-6 py-3 hover:bg-slate-100"
              >
                Close
              </button>
              {/* ✅ Correctly wired Edit button */}
              <button
                onClick={() => {
                  setEditJob(selectedJob);
                  setIsEditing(true);
                  setSelectedJob(null);
                }}
                className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
              >
                Edit Job
              </button>
              <button
                onClick={() => {
                  deleteJob(selectedJob._id);
                  setSelectedJob(null);
                }}
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================== Edit Job Modal ========================== */}
      {isEditing && editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-8 py-6">
              <h2 className="text-2xl font-bold">Edit Job</h2>
              <button
                onClick={() => { setIsEditing(false); setEditJob(null); }}
                className="rounded-lg border px-4 py-2"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleUpdateJob}
              className="max-h-[80vh] overflow-y-auto p-8 space-y-6"
            >
              <div>
                <label className="mb-2 block font-medium">Job Title</label>
                <input
                  className="w-full rounded-lg border p-3"
                  value={editJob.title}
                  onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Company</label>
                <input
                  className="w-full rounded-lg border p-3"
                  value={editJob.companyName}
                  onChange={(e) => setEditJob({ ...editJob, companyName: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Description</label>
                <textarea
                  rows={6}
                  className="w-full rounded-lg border p-3"
                  value={editJob.description}
                  onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setEditJob(null); }}
                  className="rounded-lg border px-6 py-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white"
                >
                  Update Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}