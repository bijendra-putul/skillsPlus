// app/admin/users/page.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import DeleteDialog from "../components/DeleteDialog";

const ITEMS_PER_PAGE = 10;
const ROLE_FILTERS = ["All", "admin", "user"];

interface UserRecord {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt?: string;
  isBlocked?: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [deleteUser, setDeleteUser] = useState<UserRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("userId") || "");
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem("token");

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (roleFilter !== "All") params.set("role", roleFilter);
    params.set("page", String(page));
    params.set("limit", String(ITEMS_PER_PAGE));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?${params}`, {
     headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
          },
    })
      .then((r) => r.json())
      .then((data) => {
        const list: UserRecord[] = data.users ?? data ?? [];
        setUsers(Array.isArray(list) ? list : []);
        setTotalUsers(data.total ?? (Array.isArray(list) ? list.length : 0));
      })
      .catch(() => {
        setUsers([]);
        setTotalUsers(0);
      })
      .finally(() => setLoading(false));
  }, [search, roleFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter]);

  const handleRoleChange = async (user: UserRecord, newRole: "admin" | "user") => {
    if (user.role === newRole) return;
    setUpdatingId(user._id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${user._id}`,
        {
          method: "PUT",
         headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ role: newRole }),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      showToast(`${user.name} is now ${newRole === "admin" ? "an Admin" : "a User"}`);
      fetchUsers();
    } catch {
      showToast("Failed to update role", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${deleteUser._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Delete failed");
      showToast(`${deleteUser.name} deleted successfully`);
      setDeleteUser(null);
      fetchUsers();
    } catch {
      showToast("Failed to delete user", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(totalUsers / ITEMS_PER_PAGE));

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  const avatarColor = (name: string) => {
    const colors = [
      "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
      "bg-violet-500/10 text-violet-300 border-violet-500/20",
      "bg-amber-500/10 text-amber-300 border-amber-500/20",
      "bg-rose-500/10 text-rose-300 border-rose-500/20",
      "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    ];
    const idx = name.charCodeAt(0) % colors.length;
    return colors[idx];
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <p className="text-slate-400 text-sm mt-1">
            {totalUsers} user{totalUsers !== 1 ? "s" : ""} registered
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
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
              placeholder="Search by name or email..."
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

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#13151f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all min-w-[140px] capitalize"
          >
            {ROLE_FILTERS.map((r) => (
              <option key={r} value={r} className="bg-[#13151f] capitalize">
                {r === "All" ? "All Roles" : r}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-[#13151f] border border-white/5 rounded-2xl overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Joined</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 rounded bg-white/5 animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center">
                          <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-medium">No users found</p>
                        <p className="text-slate-600 text-sm">
                          {search || roleFilter !== "All"
                            ? "Try adjusting your filters"
                            : "No registered users yet"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isSelf = user._id === currentUserId;
                    return (
                      <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${avatarColor(user.name)}`}>
                              <span className="text-xs font-bold uppercase">
                                {user.name?.charAt(0) ?? "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium leading-tight flex items-center gap-2">
                                {user.name}
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full">
                                    You
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4">
                          <p className="text-slate-400 text-sm">{user.email}</p>
                        </td>

                        {/* Role */}
                        <td className="px-4 py-4">
                          {isSelf ? (
                            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-indigo-500/10 text-indigo-400 capitalize">
                              {user.role}
                            </span>
                          ) : (
                            <div className="relative inline-block">
                              <select
                                value={user.role}
                                disabled={updatingId === user._id}
                                onChange={(e) =>
                                  handleRoleChange(user, e.target.value as "admin" | "user")
                                }
                                className={`
                                  appearance-none text-xs font-medium px-2.5 py-1 pr-7 rounded-full
                                  cursor-pointer focus:outline-none transition-all capitalize
                                  disabled:opacity-50 disabled:cursor-wait
                                  ${
                                    user.role === "admin"
                                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                                  }
                                `}
                              >
                                <option value="user" className="bg-[#13151f]">user</option>
                                <option value="admin" className="bg-[#13151f]">admin</option>
                              </select>
                              <svg
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-4">
                          <p className="text-slate-400 text-sm">{formatDate(user.createdAt)}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setDeleteUser(user)}
                              disabled={isSelf}
                              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              title={isSelf ? "You cannot delete yourself" : "Delete"}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-white/5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse space-y-2">
                  <div className="w-3/4 h-4 rounded bg-white/5" />
                  <div className="w-1/2 h-3 rounded bg-white/5" />
                </div>
              ))
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400 font-medium">No users found</p>
              </div>
            ) : (
              users.map((user) => {
                const isSelf = user._id === currentUserId;
                return (
                  <div key={user._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${avatarColor(user.name)}`}>
                          <span className="text-xs font-bold uppercase">
                            {user.name?.charAt(0) ?? "?"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate flex items-center gap-2">
                            {user.name}
                            {isSelf && (
                              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full flex-shrink-0">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-slate-500 text-xs truncate">{user.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 capitalize ${
                          user.role === "admin"
                            ? "bg-indigo-500/10 text-indigo-400"
                            : "bg-slate-500/10 text-slate-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">
                        Joined {formatDate(user.createdAt)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!isSelf && (
                          <button
                            onClick={() =>
                              handleRoleChange(
                                user,
                                user.role === "admin" ? "user" : "admin"
                              )
                            }
                            disabled={updatingId === user._id}
                            className="py-1.5 px-3 text-xs text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/10 transition-all disabled:opacity-50"
                          >
                            Make {user.role === "admin" ? "User" : "Admin"}
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteUser(user)}
                          disabled={isSelf}
                          className="py-1.5 px-3 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
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
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium ${
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

      {/* Delete dialog */}
      <DeleteDialog
        isOpen={!!deleteUser}
        title="Delete this user?"
        subtitle={deleteUser ? `${deleteUser.name} (${deleteUser.email})` : undefined}
        onConfirm={handleDelete}
        onCancel={() => setDeleteUser(null)}
        loading={deleteLoading}
      />
    </>
  );
}
