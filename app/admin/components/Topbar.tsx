// app/admin/components/Topbar.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface TopbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/jobs": "Job Management",
  "/admin/users": "User Management",
  "/admin/categories": "Categories",
  "/admin/applications": "Applications",
  "/admin/settings": "Settings",
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  const [adminName, setAdminName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name") || "Admin";
    setAdminName(name);

    const tick = () => {
      const now = new Date();

      setCurrentTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    tick();

    const interval = setInterval(tick, 60000);

    return () => clearInterval(interval);
  }, []);

  const title =
    pageTitles[pathname] ??
    pathname
      .split("/")
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, "")
      .replace(/\b\w/g, (c) => c.toUpperCase()) ??
    "Admin";

  return (
    <header className="h-16 bg-[#13151f] border-b border-white/5 px-4 md:px-6 flex items-center gap-4 sticky top-0 z-10">

      {/* Mobile Menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-400 hover:text-white transition-colors"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>


      {/* Title */}
      <div>
        <h1 className="text-white font-semibold text-base md:text-lg leading-none">
          {title}
        </h1>

        <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>


      {/* Right Side */}
      <div className="ml-auto flex items-center gap-3">

        {/* Time */}
        <span className="hidden md:block text-slate-500 text-sm tabular-nums">
          {currentTime}
        </span>


        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/10" />


        {/* Notification */}
        <button className="relative text-slate-400 hover:text-white transition-colors">

          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />

        </button>


        {/* Avatar */}
        <div className="flex items-center gap-2.5 pl-1">

          <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">

            <span className="text-indigo-300 text-xs font-semibold uppercase">
              {adminName.charAt(0)}
            </span>

          </div>


          <div className="hidden sm:block">

            <p className="text-white text-sm font-medium leading-none">
              {adminName}
            </p>

            <p className="text-indigo-400 text-xs mt-0.5">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}