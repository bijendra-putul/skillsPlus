// app/admin/components/JobForm.tsx
"use client";

import { useEffect, useState } from "react";

export interface JobFormData {
  company: string;
  location: string;
  description: string;
  requirements: string;
  skills: string;
  salary: string;
  jobType: string;
  category: string;
  applyUrl: string;
  isActive: boolean;
  experience: string;
}

export const emptyJobForm: JobFormData = {
  company: "",
  location: "",
  description: "",
  requirements: "",
  skills: "",
  salary: "",
  jobType: "Full-time",
  category: "",
  applyUrl: "",
  isActive: true,
  experience: "",
};

interface JobFormProps {
  data: JobFormData;
  onChange: (updated: JobFormData) => void;
  errors?: Partial<Record<keyof JobFormData, string>>;
}

const jobTypes = [
  "Full-time",
  "Part-time",
  "Remote",
  "Internship",
  "Contract",
  "Freelance",
];

const experienceLevels = [
  "Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5-8 years",
  "8+ years",
];

export default function JobForm({ data, onChange, errors = {} }: JobFormProps) {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        const cats = res.categories ?? res ?? [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => setCategories([]));
  }, []);

  const set = (field: keyof JobFormData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  const inputClass = (field: keyof JobFormData) =>
    `w-full bg-[#0f1117] border rounded-xl px-4 py-2.5 text-white text-sm
    placeholder-slate-600 focus:outline-none focus:ring-2 transition-all
    ${
      errors[field]
        ? "border-red-500/50 focus:ring-red-500/20"
        : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500/50"
    }`;

  const labelClass = "block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <div className="space-y-5">
      {/* Row 1 — Title + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Job Title <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className={inputClass("title")}
            placeholder="e.g. Senior React Developer"
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
          />
          {errors.title && <p className={errorClass}>{errors.title}</p>}
        </div>
        <div>
          <label className={labelClass}>
            Company <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            className={inputClass("company")}
            placeholder="e.g. Acme Corp"
            value={data.company}
            onChange={(e) => set("company", e.target.value)}
          />
          {errors.company && <p className={errorClass}>{errors.company}</p>}
        </div>
      </div>

      {/* Row 2 — Location + Job Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            className={inputClass("location")}
            placeholder="e.g. Bengaluru, India"
            value={data.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Job Type</label>
          <select
            className={inputClass("jobType")}
            value={data.jobType}
            onChange={(e) => set("jobType", e.target.value)}
          >
            {jobTypes.map((t) => (
              <option key={t} value={t} className="bg-[#13151f]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 3 — Category + Experience */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <select
            className={inputClass("category")}
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
          >
            <option value="" className="bg-[#13151f]">
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-[#13151f]">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Experience Level</label>
          <select
            className={inputClass("experience")}
            value={data.experience}
            onChange={(e) => set("experience", e.target.value)}
          >
            <option value="" className="bg-[#13151f]">
              Select experience
            </option>
            {experienceLevels.map((lvl) => (
              <option key={lvl} value={lvl} className="bg-[#13151f]">
                {lvl}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4 — Salary + Apply URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Salary (Annual in INR)</label>
          <input
            type="number"
            className={inputClass("salary")}
            placeholder="e.g. 800000"
            value={data.salary}
            onChange={(e) => set("salary", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Apply URL</label>
          <input
            type="url"
            className={inputClass("applyUrl")}
            placeholder="https://..."
            value={data.applyUrl}
            onChange={(e) => set("applyUrl", e.target.value)}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={4}
          className={inputClass("description")}
          placeholder="Describe the role, responsibilities, and what makes it exciting..."
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
        />
        {errors.description && (
          <p className={errorClass}>{errors.description}</p>
        )}
      </div>

      {/* Requirements */}
      <div>
        <label className={labelClass}>Requirements</label>
        <textarea
          rows={3}
          className={inputClass("requirements")}
          placeholder="One requirement per line, or comma-separated..."
          value={data.requirements}
          onChange={(e) => set("requirements", e.target.value)}
        />
        <p className="text-slate-600 text-xs mt-1">
          Separate multiple items with a new line or comma
        </p>
      </div>

      {/* Skills */}
      <div>
        <label className={labelClass}>Skills</label>
        <input
          type="text"
          className={inputClass("skills")}
          placeholder="e.g. React, Node.js, MongoDB, TypeScript"
          value={data.skills}
          onChange={(e) => set("skills", e.target.value)}
        />
        <p className="text-slate-600 text-xs mt-1">
          Comma-separated list of required skills
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
        <button
          type="button"
          role="switch"
          aria-checked={data.isActive}
          onClick={() => set("isActive", !data.isActive)}
          className={`
            relative inline-flex w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
            ${data.isActive ? "bg-indigo-500" : "bg-slate-700"}
          `}
        >
          <span
            className={`
              inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 my-1
              ${data.isActive ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>
        <div>
          <p className="text-white text-sm font-medium">
            {data.isActive ? "Active" : "Inactive"}
          </p>
          <p className="text-slate-500 text-xs">
            {data.isActive
              ? "Job is visible to candidates"
              : "Job is hidden from candidates"}
          </p>
        </div>
      </div>
    </div>
  );
}
