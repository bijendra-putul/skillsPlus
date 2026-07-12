// app/admin/jobs/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import CreateJobModal from "../components/CreateJobModal";
import EditJobModal, { JobRecord } from "../components/EditJobModal";
import ViewJobModal from "../components/ViewJobModal";
import DeleteDialog from "../components/DeleteDialog";

const ITEMS_PER_PAGE = 10;

const JOB_TYPES = ["All", "Full-time", "Part-time", "Remote", "Internship", "Contract", "Freelance"];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editJob, setEditJob] = useState<JobRecord | null>(null);
  const [viewJob, setViewJob] = useState<JobRecord | null>(null);
  const [deleteJob, setDeleteJob] = useState<JobRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchJobs = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (typeFilter !== "All") params.set("jobType", typeFilter);
    if (statusFilter !== "All") params.set("isActive", statusFilter === "Active" ? "true" : "false");
    params.set("page", String(page));
    params.set("limit", String(ITEMS_PER_PAGE));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        const list: JobRecord[] = data.jobs ?? data ?? [];
        setJobs(Array.isArray(list) ? list : []);
        setTotalJobs(data.total ?? (Array.isArray(list) ? list.length : 0));
      })
      .catch(() => {
        setJobs([]);
        setTotalJobs(0);
      })
      .finally(() => setLoading(false));
  }, [search, typeFilter, statusFilter, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, statusFilter]);

  const handleDelete = async () => {
    if (!deleteJob) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${deleteJob._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      showToast(`"${deleteJob.title}" deleted successfully`);
      setDeleteJob(null);
      fetchJobs();
    } catch {
      showToast("Failed to delete job", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalJobs / ITEMS_PER_PAGE));

  const jobTypeBadgeClass: Record<string, string> = {
    "Full-time": "bg-emerald-500/10 text-emerald-400",
    "Part-time": "bg-amber-500/10 text-amber-400",
    Remote: "bg-indigo-500/10 text-indigo-400",
    Internship: "bg-violet-500/10 text-violet-400",
    Contract: "bg-rose-500/10 text-rose-400",
    Freelance: "bg-cyan-500/10 text-cyan-400",
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white">Job Management</h2>
            <p className="text-slate-400 text-sm mt-1">
              {totalJobs} job{totalJobs !== 1 ? "s" : ""} in total
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Post New Job
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#13151f] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-[#13151f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all min-w-[140px]"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t} className="bg-[#13151f]">
                {t}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#13151f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all min-w-[120px]"
          >
            {["All", "Active", "Inactive"].map((s) => (
              <option key={s} value={s} className="bg-[#13151f]">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#13151f] border border-white/5 rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Job
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Posted
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 6 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 rounded bg-white/5 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium">No jobs found</p>
                        <p className="text-slate-600 text-sm">
                          {search || typeFilter !== "All" || statusFilter !== "All"
                            ? "Try adjusting your filters"
                            : "Post your first job to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Job info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-300 text-xs font-bold uppercase">
                              {job.company?.charAt(0) ?? "?"}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium leading-tight">
                              {job.title}
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {job.company}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            jobTypeBadgeClass[job.jobType ?? ""] ??
                            "bg-slate-500/10 text-slate-400"
                          }`}
                        >
                          {job.jobType ?? "—"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-4">
                        <p className="text-slate-400 text-sm">
                          {job.location || "—"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                            job.isActive !== false
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-slate-500/10 text-slate-500"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              job.isActive !== false
                                ? "bg-emerald-400"
                                : "bg-slate-500"
                            }`}
                          />
                          {job.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-4">
                        <p className="text-slate-400 text-sm">
                          {job.createdAt ? formatDate(job.createdAt) : "—"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* View */}
                          <button
                            onClick={() => setViewJob(job)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                            title="View"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditJob(job)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteJob(job)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="w-3/4 h-4 rounded bg-white/5" />
                  <div className="w-1/2 h-3 rounded bg-white/5" />
                </div>
              ))
            ) : jobs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-medium">No jobs found</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-300 text-xs font-bold uppercase">
                          {job.company?.charAt(0) ?? "?"}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {job.title}
                        </p>
                        <p className="text-slate-500 text-xs">{job.company}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        job.isActive !== false
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-500/10 text-slate-500"
                      }`}
                    >
                      {job.isActive !== false ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        jobTypeBadgeClass[job.jobType ?? ""] ??
                        "bg-slate-500/10 text-slate-400"
                      }`}
                    >
                      {job.jobType ?? "—"}
                    </span>
                    {job.location && (
                      <span className="text-xs text-slate-500">
                        {job.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setViewJob(job)}
                      className="flex-1 py-1.5 text-xs text-slate-400 border border-white/10 rounded-lg hover:text-white hover:border-white/20 transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setEditJob(job)}
                      className="flex-1 py-1.5 text-xs text-amber-400 border border-amber-500/20 rounded-lg hover:bg-amber-500/10 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteJob(job)}
                      className="flex-1 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
              <p className="text-slate-500 text-sm">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                      ? totalPages - 4 + i
                      : page - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all ${
                        pageNum === page
                          ? "bg-indigo-500 text-white"
                          : "border border-white/10 text-slate-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all animate-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* Modals */}
      <CreateJobModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          fetchJobs();
          showToast("Job posted successfully");
        }}
      />

      <EditJobModal
        isOpen={!!editJob}
        job={editJob}
        onClose={() => setEditJob(null)}
        onUpdated={() => {
          fetchJobs();
          showToast("Job updated successfully");
        }}
      />

      <ViewJobModal
        isOpen={!!viewJob}
        job={viewJob}
        onClose={() => setViewJob(null)}
        onEdit={(job) => setEditJob(job)}
      />

      <DeleteDialog
        isOpen={!!deleteJob}
        title="Delete this job?"
        subtitle={
          deleteJob
            ? `"${deleteJob.title}" at ${deleteJob.company}`
            : undefined
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteJob(null)}
        loading={deleteLoading}
      />
    </>
  );
}
