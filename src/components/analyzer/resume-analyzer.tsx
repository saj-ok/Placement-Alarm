"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Loader2, Target, Sparkles, Wand2, ArrowRight} from "lucide-react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import mammoth from "mammoth";
import ScoreCircle from "./ScoreCircle";
import CategoryScore from "./CategoryScore";
import { parsePdf } from "@/lib/parsePdf";
import toast from "react-hot-toast";
import FileUploadZone from "./FileUploadZone";
import JobDescriptionInput from "./JobDesInput";

export function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [jobDescriptionFile, setJobDescriptionFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const analyze = useAction(api.gemini.analyzeResume);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error("Please upload a resume.");
      return;
    }
    if (!jobDescription || !jobDescriptionFile) {
      toast.error("Please provide a job description.");
      return;
    }
    setIsLoading(true);
    setAnalysis(null);

    try {
      // Parse resume text
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
        toast.error("Unsupported file type. Please upload a PDF or DOCX file.");
        setIsLoading(false);
        return;
      }

      // Parse job description text
      let jobDescriptionText = "";
      if (jobDescriptionFile.type === "application/pdf") {
        jobDescriptionText = await parsePdf(jobDescriptionFile);
      } else if (
        jobDescriptionFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const arrayBuffer = await jobDescriptionFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        jobDescriptionText = result.value;
      } else {
        toast.error("Unsupported file type. Please upload a PDF or DOCX file.");
        setIsLoading(false);
        return;
      }

      // Run analysis
      const result = await analyze({
        resumeText: resumeText,
        jobDescriptionText: jobDescription || jobDescriptionText,
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Optimize Your Resume
        </h1>
        <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
          Get AI-powered insights on how well your resume matches any job description, with specific suggestions for improvement.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-6 mb-12">
        <FileUploadZone
          title="Upload Resume"
          description="Upload your resume in PDF or DOCX format"
          acceptedTypes=".pdf,.docx"
          onFileSelect={handleFileChange}
          icon={FileUp}
          file={resumeFile ?? undefined}
          dragActive={isDragging}
        />
       <JobDescriptionInput
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        jobFile={jobDescriptionFile}
        onJobFileSelect={setJobDescriptionFile}
        dragActive={isDragging}
        />
      </div>

      <div className="text-center">
        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading} 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
              Analyzing...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-5 w-5" /> 
              Analyze Resume
            </>
          )}
        </Button>
      </div>

      {/* Results Card - No changes to the results section */}
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