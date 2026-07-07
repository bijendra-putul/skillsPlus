
"use client";

import { useState } from "react";

type Props = {
  onGenerate: (code: string) => void;
};

export default function PromptPanel({ onGenerate }: Props) {
 // const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    // const data = await res.json();
    // console.log("API RESPONSE:", data);
    // onGenerate(data.code || "");
    const data = await res.json();

if (!res.ok) {
  console.error(data.error);  
  onGenerate(`// ERROR:\n${data.error}`);
  return;
}

console.log(data.code);

onGenerate(data.code);

    setLoading(false);
  };

  return (
    <div className="border-b border-slate-800 p-6">
      <h2 className="text-xl font-bold text-white">
        What would you like to build?
      </h2>

      <textarea
        className="mt-4 h-40 w-full rounded-lg border border-slate-700 bg-slate-900 p-4 text-white outline-none"
        placeholder="Build a SaaS landing page..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={loading}
        className="mt-4 rounded-lg bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}

