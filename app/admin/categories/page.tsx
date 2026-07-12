// app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
  jobCount?: number;
  createdAt: string;
}

const ICONS = ["💻","📣","🎨","💰","🏥","📚","🤝","👥","🚀","🏗️","⚖️","🎭","✈️","🛒","📊","🔬"];

const defaultForm = { name: "", slug: "", icon: "💼", isActive: true };

export default function CategoriesPage() {
  const [categories, setCategories]     = useState<Category[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showModal, setShowModal]       = useState(false);
  const [editTarget, setEditTarget]     = useState<Category | null>(null);
  const [form, setForm]                 = useState(defaultForm);
  const [saving, setSaving]             = useState(false);
  const [search, setSearch]             = useState("");
  const [deleteId, setDeleteId]         = useState<string | null>(null);

  const token = () => localStorage.getItem("token") ?? "";

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json();
      setCategories(data.categories ?? data ?? []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const openCreate = () => {
    setEditTarget(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, isActive: cat.isActive });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url    = editTarget
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/categories/${editTarget._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
    const method = editTarget ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchCategories();
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    setDeleteId(null);
    fetchCategories();
  };

  const toggleActive = async (cat: Category) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${cat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ ...cat, isActive: !cat.isActive }),
    });
    fetchCategories();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Categories</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage job categories shown to applicants
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total",    value: categories.length,                              color: "text-white" },
          { label: "Active",   value: categories.filter((c) => c.isActive).length,   color: "text-emerald-400" },
          { label: "Inactive", value: categories.filter((c) => !c.isActive).length,  color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#13151f] border border-white/5 rounded-2xl px-5 py-4">
            <p className="text-slate-400 text-xs mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#13151f] border border-white/5 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      {/* Table */}
      <div className="bg-[#13151f] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="divide-y divide-white/5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 rounded bg-white/5" />
                  <div className="w-20 h-3 rounded bg-white/5" />
                </div>
                <div className="w-16 h-5 rounded-full bg-white/5" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No categories found</p>
            <button onClick={openCreate} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm">
              Add your first category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {/* Header row */}
            <div className="px-6 py-3 grid grid-cols-12 text-xs font-medium text-slate-500 uppercase tracking-wide">
              <span className="col-span-5">Category</span>
              <span className="col-span-3">Slug</span>
              <span className="col-span-2">Status</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {filtered.map((cat) => (
              <div key={cat._id} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-white/[0.02] transition-colors">
                {/* Icon + Name */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xl flex-shrink-0">
                    {cat.icon}
                  </div>
                  <span className="text-white text-sm font-medium truncate">{cat.name}</span>
                </div>

                {/* Slug */}
                <div className="col-span-3">
                  <span className="text-xs text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-lg">
                    {cat.slug}
                  </span>
                </div>

                {/* Status toggle */}
                <div className="col-span-2">
                  <button
                    onClick={() => toggleActive(cat)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      cat.isActive
                        ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-slate-500/10 text-slate-400 hover:bg-slate-500/20"
                    }`}
                  >
                    {cat.isActive ? "Active" : "Inactive"}
                  </button>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteId(cat._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create / Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-md bg-[#13151f] border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h3 className="text-white font-semibold text-lg">
                {editTarget ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Icon picker */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((ic) => (
                    <button
                      key={ic} type="button"
                      onClick={() => setForm({ ...form, icon: ic })}
                      className={`w-10 h-10 rounded-xl text-xl transition-all ${
                        form.icon === ic
                          ? "bg-indigo-500/20 border-2 border-indigo-500/60 scale-110"
                          : "bg-white/5 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                  <input
                    type="text" maxLength={2}
                    value={!ICONS.includes(form.icon) ? form.icon : ""}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="✏️"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Technology"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Slug</label>
                <input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="technology"
                />
              </div>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    form.isActive ? "bg-indigo-500" : "bg-slate-600"
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm text-slate-300">Active</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-white/10 text-slate-300 py-3 text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 text-sm transition-colors"
                >
                  {saving ? "Saving…" : editTarget ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-sm bg-[#13151f] border border-white/10 rounded-2xl p-6 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Delete Category?</h3>
            <p className="text-slate-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-white/10 text-slate-300 py-2.5 text-sm hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 text-sm transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}