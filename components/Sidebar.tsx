"use client";

import {
  Folder,
  MessageSquare,
  Settings,
  FileCode,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-950">
      <div className="p-4 text-white font-semibold">
        Workspace
      </div>

      <nav className="space-y-2 p-4">

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-800">
          <Folder size={18} />
          Files
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-800">
          <MessageSquare size={18} />
          Chat
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-800">
          <FileCode size={18} />
          Components
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg p-3 hover:bg-slate-800">
          <Settings size={18} />
          Settings
        </button>

      </nav>
    </aside>
  );
}