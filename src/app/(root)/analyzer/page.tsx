"use client";

import AnalyzerResult from "@/components/analyzer/AnalyzerResult";
import { ResumeAnalyzer } from "@/components/analyzer/resume-analyzer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ResumeEditor } from "@/components/analyzer/ResumeEditor";


export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState("analyzer");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const analysisHistory = useQuery(api.gemini.getAnalysisHistory);

  const handleAnalysisComplete = (result: any) => {
    setAnalysisResult(result);
    setGeneratedResume(null); // Clear previous generated resume
    setActiveTab("result");
  };

  const handleResumeGenerated = (text: string) => {
    setGeneratedResume(text);
    setActiveTab("editor");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold text-white tracking-tight">
            Optimize Your Resume
          </h1>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Get AI-powered insights on how well your resume matches any job description, with specific suggestions for improvement.
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="pb-11 px-6 grid w-full grid-cols-3 gap-6 mb-4 bg-gray-700/50 border border-gray-600/50">
            <TabsTrigger value="analyzer" className={`p-2 ${activeTab === "analyzer" ? "text-black" : "text-white"}`}>Analyzer</TabsTrigger>
            <TabsTrigger value="result" className={`p-2 ${activeTab === "result" ? "text-black" : "text-white"}`}>Results</TabsTrigger>
            <TabsTrigger value="editor" disabled={!generatedResume} className={`p-2 ${activeTab === "editor" ? "text-black" : "text-white"}`}>Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="analyzer">
            <ResumeAnalyzer onAnalysisComplete={handleAnalysisComplete} />
          </TabsContent>
          <TabsContent value="result">
            <AnalyzerResult
              result={analysisResult}
              history={analysisHistory}
              onGenerateResume={handleResumeGenerated}
            />
          </TabsContent>
          <TabsContent value="editor">
            {generatedResume && <ResumeEditor initialText={generatedResume} />}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}