// app/admin/components/CreateJobModal.tsx
"use client";

import { useState } from "react";
import JobForm, { JobFormData, emptyJobForm } from "./JobForm";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function validate(data: JobFormData): Partial<Record<keyof JobFormData, string>> {
  const errs: Partial<Record<keyof JobFormData, string>> = {};
  if (!data.title.trim()) errs.title = "Job title is required";
  if (!data.company.trim()) errs.company = "Company name is required";
  if (!data.description.trim()) errs.description = "Description is required";
  return errs;
}

export default function CreateJobModal({
  isOpen,
  onClose,
  onCreated,
}: CreateJobModalProps) {
  const [form, setForm] = useState<JobFormData>(emptyJobForm);
  const [errors, setErrors] = useState<Partial<Record<keyof JobFormData, string>>>({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleClose = () => {
    setForm(emptyJobForm);
    setErrors({});
    setServerError("");
    onClose();
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    setServerError("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...form,
        salary: form.salary ? Number(form.salary) : undefined,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        requirements: form.requirements
          ? form.requirements
              .split(/[\n,]+/)
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message ?? "Failed to create job");
      }

      onCreated();
      handleClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#13151f] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">Post New Job</h2>
              <p className="text-slate-500 text-xs">Fill in the details below</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 max-h-[65vh] overflow-y-auto">
          {serverError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {serverError}
            </div>
          )}
          <JobForm data={form} onChange={setForm} errors={errors} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5">
          <button
            onClick={handleClose}
            disabled={saving}
            className="px-5 py-2.5 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl transition-all"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post Job
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
