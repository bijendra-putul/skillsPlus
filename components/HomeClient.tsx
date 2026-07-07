
"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import PromptPanel from "@/components/PromptPanel";
import PreviewPanel from "@/components/PreviewPanel";
import CodeEditor from "@/components/CodeEditor";

export default function HomeClient() {
  const [code, setCode] = useState("");

  return (
    <div className="h-screen bg-slate-950 text-white">
      <Header />

      <div className="flex h-[calc(100vh-56px)]">
        <Sidebar />

        <main className="flex-1 flex flex-col">
          <PromptPanel onGenerate={setCode} />

          <div className="flex-1">
            <PreviewPanel />
          </div>

          <CodeEditor code={code} />
        </main>
      </div>
    </div>
  );
}

