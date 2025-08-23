"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, FileText, Sparkles,  Download, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import ScoreCircle from "./ScoreCircle";
import CategoryScore from "./CategoryScore";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAction } from 'convex/react';
import toast from 'react-hot-toast';
import { api } from '../../../convex/_generated/api';


function AnalyzerResult({ result, history, onGenerateResume }: { result: any, history: any[] | undefined, onGenerateResume: (text: string) => void }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const generateResumeAction = useAction(api.gemini.generateResume);

  const handleGenerateClick = async () => {
    if (!result) return;
    setIsGenerating(true);
    try {
      const originalResumeText = "...."; // You will need to pass the original resume text down to this component
      const generatedText = await generateResumeAction({
        resumeText: originalResumeText, // This needs to be available here
        suggestions: result.actionable_suggestions,
      });
      onGenerateResume(generatedText);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800/40 border-gray-700/50">
        <CardHeader>
             <div className="flex justify-between items-center">
            <CardTitle className="text-3xl text-white flex items-center gap-3">
              <Sparkles size={28} className="text-yellow-300" />
              Resume Analysis Report
            </CardTitle>
            <Button onClick={handleGenerateClick} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate & Edit Resume
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* Overall Score & Summary */}
          <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-gray-900/30 rounded-lg border border-gray-700/50">
            <ScoreCircle score={result.overall_score} />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">Overall Match</h3>
              <p className="text-slate-300 mb-4">{result.summary}</p>
              <div className="p-4 bg-gray-800/50 rounded-md">
                <h4 className="font-semibold text-purple-400 mb-1">Recruiter's First Impression:</h4>
                <p className="text-slate-300 italic">"{result.first_impression}"</p>
              </div>
            </div>
          </div>

          {/* Categorical Scores & ATS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-xl font-semibold text-white flex items-center gap-2"><BarChart size={20} /> Categorical Breakdown</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.categorical_scores.map((cat: any) => <CategoryScore key={cat.category} {...cat} />)}
              </div>
            </div>
            <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700/50">
              <h4 className="text-xl font-semibold text-white mb-3">ATS Compatibility</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className={`text-3xl font-bold ${result.ats_compatibility.score > 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {result.ats_compatibility.score}%
                </div>
                <p className="text-slate-400 text-sm">Your resume's compatibility with Applicant Tracking Systems.</p>
              </div>
              <div className="space-y-2">
                {result.ats_compatibility.suggestions.map((sugg: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <span>{sugg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Missing Keywords */}
          {result.missing_keywords.length > 0 && (
            <div>
              <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-400" /> Missing Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((keyword: string) => (
                  <span key={keyword} className="px-3 py-1 bg-red-500/20 text-red-300 text-sm font-medium rounded-full border border-red-500/30">{keyword}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Suggestions */}
          <div>
            <h4 className="text-xl font-semibold text-white mb-4">Actionable Suggestions</h4>
            <div className="space-y-4">
              {result.actionable_suggestions.map((sugg: any, index: number) => (
                <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="font-semibold text-purple-400 text-lg mb-2">{sugg.area}</p>
                  <p className="text-white mb-3">{sugg.suggestion}</p>
                  {sugg.example.before && (
                    <div className="p-2 bg-red-900/30 rounded-md mb-2">
                      <p className="text-sm text-red-300 italic">"<del>{sugg.example.before}</del>"</p>
                    </div>
                  )}
                  <div className="p-2 bg-green-900/30 rounded-md flex items-center gap-2">
                    <ArrowRight size={16} className="text-green-400" />
                    <p className="text-sm text-green-300 italic">"{sugg.example.after}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyzerResult;