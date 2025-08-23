"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Download, Copy } from "lucide-react";
import { downloadResumeAsDocx } from "@/lib/docx-generator";
import toast from "react-hot-toast";

export function ResumeEditor({ initialText }: { initialText: string }) {
  const [text, setText] = useState(initialText);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Resume text copied to clipboard!");
  };

  const handleDownload = () => {
    downloadResumeAsDocx(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={handleCopy} variant="outline" className="bg-gray-700/50 border-gray-600/50 text-white hover:bg-gray-600/70">
          <Copy className="h-4 w-4 mr-2" />
          Copy Text
        </Button>
        <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Download as .docx
        </Button>
      </div>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[600px] bg-gray-800/50 border-gray-700 text-base p-4"
        placeholder="Your generated resume will appear here..."
      />
    </div>
  );
}