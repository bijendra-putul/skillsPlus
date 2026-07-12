import React from 'react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  onView?: () => void;
  onSelect: (job: Job) => void;
  onDelete?: () => void | Promise<void>;
}

export default function JobCard({ job, onSelect }: JobCardProps) {
  const formatSalary = (val?: number) => {
    if (!val) return '';
    return `₹${(val / 100000).toFixed(1)}L`;
  };

  const hasSalaryRange = job.salaryMin || job.salaryMax;

  return (
    <div 
      className={`relative flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl bg-white p-6 border transition-all duration-200 hover:shadow-md cursor-pointer ${
        job.isFeatured ? 'border-indigo-200 bg-gradient-to-r from-indigo-50/10 to-white' : 'border-slate-200/70'
      }`}
      onClick={() => onSelect(job)}
    >
      {job.isFeatured && (
        <span className="absolute -top-2.5 left-6 inline-flex items-center rounded-md bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
          Featured
        </span>
      )}

      {}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600 border border-indigo-100">
          {job.companyName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
            {job.title}
          </h3>
          <p className="text-sm font-medium text-slate-500">{job.companyName}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
            <span className="font-semibold text-indigo-600 flex items-center gap-1">
              📍 {job.locationType} ({job.location})
            </span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{job.jobType}</span>
            {hasSalaryRange && (
              <>
                <span>•</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  💰 {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} / yr
                </span>
              </>
            )}
          </div>

          {/* Tagged skills */}
          <div className="mt-3 flex flex-wrap gap-1">
            {job.skills.map((s) => (
              <span key={s} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[11px] font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* View trigger details buttons */}
      <div className="flex items-center shrink-0">
        <button 
          className="w-full md:w-auto text-center rounded-xl bg-slate-50 hover:bg-indigo-50 px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition border border-slate-200 hover:border-indigo-200"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}