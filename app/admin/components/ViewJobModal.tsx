// app/admin/components/ViewJobModal.tsx
"use client";

import { JobRecord } from "./EditJobModal";

interface ViewJobModalProps {
  isOpen: boolean;
  job: JobRecord | null;
  onClose: () => void;
  onEdit: (job: JobRecord) => void;
}

export default function ViewJobModal({
  isOpen,
  job,
  onClose,
  onEdit,
}: ViewJobModalProps) {
  if (!isOpen || !job) return null;

  const formatSalary = (val?: number) => {
    if (!val) return "Not specified";
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L / year`;
    return `${val.toLocaleString("en-IN")} / year`;
  };

  const normalizeArray = (val?: string | string[]): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    return val
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const skills = normalizeArray(job.skills);
  const requirements = normalizeArray(job.requirements);

  const categoryName =
    typeof job.category === "object" && job.category !== null
      ? job.category.name
      : (job.category ?? "—");

  const jobTypeBadgeClass: Record<string, string> = {
    "Full-time": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Part-time": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Remote: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    Internship: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    Contract: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    Freelance: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  const typeCls =
    jobTypeBadgeClass[job.jobType ?? ""] ??
    "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#13151f] border border-white/10 rounded-2xl shadow-2xl z-10">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-300 text-lg font-bold uppercase">
                {job.company?.charAt(0) ?? "?"}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-lg leading-tight truncate">
                {job.title}
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">{job.company}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeCls}`}>
                  {job.jobType ?? "N/A"}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                    job.isActive !== false
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                  }`}
                >
                  {job.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors flex-shrink-0 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[65vh] overflow-y-auto space-y-6">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "Location",
                value: job.location || "—",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
              {
                label: "Salary",
                value: formatSalary(job.salary),
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                label: "Category",
                value: categoryName,
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
              },
              {
                label: "Experience",
                value: job.experience || "—",
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/[0.02] border border-white/5 rounded-xl p-3"
              >
                <div className="text-slate-500 mb-1">{item.icon}</div>
                <p className="text-slate-500 text-xs">{item.label}</p>
                <p className="text-white text-sm font-medium mt-0.5 truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              Description
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Requirements
              </h4>
              <ul className="space-y-1.5">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply URL */}
          {job.applyUrl && (
            <div>
              <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                Apply Link
              </h4>
              <a
                href={job.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2 break-all"
              >
                {job.applyUrl}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(job);
            }}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Job
          </button>
        </div>
      </div>
    </div>
  );
}
