import { ResumeAnalyzer } from "@/components/analyzer/resume-analyzer";
import { DashboardLayout } from "@/components/layout/dashboard-layout";


export default function AnalyzerPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ResumeAnalyzer />
      </div>
    </DashboardLayout>
  );
}