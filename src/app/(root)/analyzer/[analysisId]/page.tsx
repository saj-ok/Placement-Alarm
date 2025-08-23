"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import AnalyzerResult from "@/components/analyzer/AnalyzerResult";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function AnalysisDetailPage({ params }: { params: { analysisId: Id<"analyses"> } }) {
  const analysis = useQuery(api.gemini.getAnalysisById, { id: params.analysisId });

  if (analysis === undefined) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (analysis === null) {
    return (
      <DashboardLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Analysis not found</h1>
          <p>This analysis may have been deleted or you may not have permission to view it.</p>
          <Link href="/analyzer" className="text-blue-400 hover:underline">
            Back to Analyzer
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <Link href="/analyzer" className="text-blue-400 hover:underline">
          &larr; Back to Analyzer
        </Link>
      </div>
      <AnalyzerResult result={analysis.analysis} history={[]} />
    </DashboardLayout>
  );
}