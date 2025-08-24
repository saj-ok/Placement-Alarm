"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Sparkles, CheckCircle, AlertCircle, ArrowRight, TrendingUp, Target, Zap, Award } from "lucide-react";
import ScoreCircle from "./ScoreCircle";
import CategoryScore from "./CategoryScore";

function AnalyzerResult({ result, history }: { result: any, history: any[] | undefined}) {

  return (
    <div className="space-y-8">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-slate-700/50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis Report</h1>
                <p className="text-slate-300">AI-powered insights for your career advancement</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Award className="h-5 w-5 text-yellow-400" />
              <span className="text-white font-semibold">Professional Analysis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Score & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
                <Target className="h-5 w-5 text-blue-400" />
                Overall Match Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <ScoreCircle score={result.overall_score} />
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-2">Match Quality</p>
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  <span className="text-lg font-semibold text-white">
                    {result.overall_score >= 80 ? 'Excellent' : 
                     result.overall_score >= 60 ? 'Good' : 
                     result.overall_score >= 40 ? 'Fair' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Analysis Overview
                </h4>
                <p className="text-slate-300 leading-relaxed">{result.summary}</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  First Impression Assessment
                </h4>
                <p className="text-slate-300 italic leading-relaxed">"{result.first_impression}"</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-400" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.categorical_scores.map((cat: any, index: number) => (
                  <div key={cat.category} className="space-y-3">
                    <CategoryScore {...cat} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm h-full">
            <CardHeader>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${
                  result.ats_compatibility.score > 70 ? 'text-green-400' : 
                  result.ats_compatibility.score > 50 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {result.ats_compatibility.score}%
                </div>
                <p className="text-sm text-slate-400">System Compatibility</p>
              </div>
              
              <div className="space-y-3">
                <h5 className="text-sm font-semibold text-slate-300">Optimization Tips:</h5>
                {result.ats_compatibility.suggestions.slice(0, 3).map((sugg: string, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0"></div>
                    <span className="leading-relaxed">{sugg}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Missing Keywords Section */}
      {result.missing_keywords.length > 0 && (
        <Card className="bg-gradient-to-br from-red-900/10 to-orange-900/10 border-red-500/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-400" />
              Critical Keywords Missing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-slate-300 text-sm">
                These important keywords from the job description are missing from your resume:
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {result.missing_keywords.map((keyword: string, index: number) => (
                <div key={keyword} className="group relative">
                  <span className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-full border border-red-500/30 hover:bg-red-500/30 transition-colors cursor-pointer">
                    {keyword}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Recommendations */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-blue-400" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {result.actionable_suggestions.map((sugg: any, index: number) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-4 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-400 mb-2">{sugg.area}</h4>
                      <p className="text-slate-300 leading-relaxed">{sugg.suggestion}</p>
                    </div>
                    
                    <div className="space-y-3">
                      {sugg.example.before && (
                        <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Current</span>
                          </div>
                          <p className="text-sm text-red-300 italic line-through">"{sugg.example.before}"</p>
                        </div>
                      )}
                      
                      <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <ArrowRight className="w-3 h-3 text-green-400" />
                          <span className="text-xs font-medium text-green-400 uppercase tracking-wide">Improved</span>
                        </div>
                        <p className="text-sm text-green-300 italic">"{sugg.example.after}"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyzerResult;