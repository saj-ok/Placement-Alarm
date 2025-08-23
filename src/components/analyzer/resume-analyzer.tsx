"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, BrainCircuit, Loader2, Target, Briefcase, Sparkles, Wand2, ArrowRight } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import mammoth from "mammoth";

// We will import pdfjs-dist dynamically inside the function that needs it.

async function parsePdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str || '').join(" ");
  }
  return text;
}

// --- UI Components for Analysis Results ---

const ScoreCircle = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score > 75 ? "stroke-green-400" : score > 50 ? "stroke-yellow-400" : "stroke-red-400";

  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <circle
          className={`${color} transition-all duration-1000 ease-in-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute text-4xl font-bold text-white">{score}%</span>
    </div>
  );
};

const CategoryScore = ({ category, score, explanation }: { category: string, score: number, explanation: string }) => (
  <div className="p-4 bg-gray-900/50 rounded-lg">
    <div className="flex justify-between items-center mb-1">
      <h5 className="font-semibold text-white">{category}</h5>
      <span className="font-bold text-purple-400">{score}/100</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
    </div>
    <p className="text-sm text-slate-400 mt-2">{explanation}</p>
  </div>
);

// --- Main Analyzer Component ---

export function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const analyze = useAction(api.gemini.analyzeResume);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription) {
      alert("Please upload a resume and provide a job description.");
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      let resumeText = "";
      if (resumeFile.type === "application/pdf") {
        resumeText = await parsePdf(resumeFile);
      } else if (
        resumeFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await resumeFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        resumeText = result.value;
      } else {
        alert("Unsupported file type. Please upload a PDF or DOCX file.");
        setIsLoading(false);
        return;
      }

      const result = await analyze({
        resumeText: resumeText,
        jobDescriptionText: jobDescription,
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
              <BrainCircuit className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white font-bold">
                AI Resume Analyzer
              </CardTitle>
              <p className="text-sm text-slate-300 mt-1 font-medium">
                Get instant feedback on your resume against a job description.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Resume Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2"><FileUp size={20} /> Upload Your Resume</h3>
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileUp className="w-8 h-8 mb-4 text-gray-400" />
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">PDF or DOCX</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
            </label>
            {resumeFile && <p className="text-sm text-green-400">Uploaded: {resumeFile.name}</p>}
          </div>
          {/* Job Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Briefcase size={20} /> Paste Job Description</h3>
            <textarea
              className="w-full h-48 p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder:text-gray-400 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </CardContent>
        <div className="p-6">
          <Button onClick={handleAnalyze} disabled={isLoading} className="w-full text-base font-semibold py-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white border-0 shadow-xl">
            {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</> : <><Wand2 className="mr-2 h-5 w-5" /> Analyze Resume</>}
          </Button>
        </div>
      </Card>

      {/* Results Card */}
      {analysis && (
        <Card className="bg-gray-800/40 border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2"><Sparkles size={24} className="text-yellow-300" /> Analysis Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Overall Score & Summary */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-900/30 rounded-lg">
              <ScoreCircle score={analysis.overall_score} />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Overall Match</h3>
                <p className="text-slate-300">{analysis.summary}</p>
              </div>
            </div>

            {/* Categorical Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.categorical_scores.map((cat: any) => <CategoryScore key={cat.category} {...cat} />)}
            </div>

            {/* Missing Keywords */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2"><Target size={20} /> Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_keywords.map((keyword: string) => (
                  <span key={keyword} className="px-3 py-1 bg-red-500/20 text-red-300 text-sm font-medium rounded-full border border-red-500/30">{keyword}</span>
                ))}
              </div>
            </div>

            {/* Actionable Suggestions */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Actionable Suggestions</h4>
              <div className="space-y-4">
                {analysis.actionable_suggestions.map((sugg: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <p className="font-semibold text-purple-400 text-lg mb-2">{sugg.area}</p>
                    <p className="text-white mb-3">{sugg.suggestion}</p>
                    {sugg.example.before && <p className="text-sm text-red-400 mb-1 italic">"<del>{sugg.example.before}</del>"</p>}
                    <div className="flex items-center gap-2">
                      <ArrowRight size={16} className="text-green-400" />
                      <p className="text-sm text-green-300 italic">"{sugg.example.after}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}