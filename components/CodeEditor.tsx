
"use client";

import Editor from "@monaco-editor/react";

export default function CodeEditor({ code }: { code: string }) {
  return (
    <div className="h-96 border-t border-slate-800">
      <Editor
        theme="vs-dark"
        defaultLanguage="typescript"
        value={code}
      />
    </div>
  );
}   
