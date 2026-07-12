    // app/admin/components/DashboardCards.tsx
"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}

interface StatsData {
  totalJobs: number;
  totalUsers: number;
  totalApplications: number;
  activeJobs: number;
}


export default function DashboardCards() {
  const [stats, setStats] = useState<StatsData>({
    totalJobs: 0,
    totalUsers: 0,
    totalApplications: 0,
    activeJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
          },
      }).then((r) => r.json()).catch(() => ({ jobs: [] })),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
         },
      }).then((r) => r.json()).catch(() => ({ users: [] })),
    ])
      .then(([jobsData, usersData]) => {
        const jobs = jobsData.jobs ?? jobsData ?? [];
        const users = usersData.users ?? usersData ?? [];
        const activeJobs = Array.isArray(jobs)
          ? jobs.filter((j: { isActive?: boolean }) => j.isActive !== false).length
          : 0;

        setStats({
          totalJobs: Array.isArray(jobs) ? jobs.length : 0,
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalApplications: 0, // wire up when applications endpoint is ready
          activeJobs,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards: Stat[] = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      change: "+12% this month",
      positive: true,
      color: "indigo",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        </svg>
      ),
    },
    {
      label: "Active Jobs",
      value: stats.activeJobs,
      change: "Currently live",
      positive: true,
      color: "emerald",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Users",
      value: stats.totalUsers,
      change: "+5% this month",
      positive: true,
      color: "violet",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      change: "All time",
      positive: true,
      color: "amber",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
    indigo: {
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      border: "border-indigo-500/20",
      glow: "shadow-indigo-500/10",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      glow: "shadow-emerald-500/10",
    },
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/20",
      glow: "shadow-violet-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      glow: "shadow-amber-500/10",
    },
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#13151f] border border-white/5 rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/5" />
              <div className="w-16 h-4 rounded bg-white/5" />
            </div>
            <div className="w-16 h-8 rounded bg-white/5 mb-2" />
            <div className="w-24 h-3 rounded bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const c = colorMap[card.color];
        return (
          <div
            key={card.label}
            className={`
              bg-[#13151f] border ${c.border} rounded-2xl p-6
              shadow-lg ${c.glow}
              hover:border-opacity-40 transition-all duration-200
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center ${c.text}`}>
                {card.icon}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${c.bg} ${c.text}`}
              >
                {card.positive ? "+" : ""}
              </span>
            </div>

            <p className="text-3xl font-bold text-white tabular-nums">
              {typeof card.value === "number"
                ? card.value.toLocaleString("en-IN")
                : card.value}
            </p>
            <p className="text-slate-400 text-sm mt-1">{card.label}</p>
            <p className={`text-xs mt-2 ${c.text}`}>{card.change}</p>
          </div>
        );
      })}
    </div>
  );
}
