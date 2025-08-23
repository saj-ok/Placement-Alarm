import { cn } from "@/lib/utils";
import { FileClock, Sparkles } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";

interface AnalysisSidebarProps {
  analyses: any[];
  currentAnalysis: any | null;
  selectedId: Id<"analyses"> | "new" | null;
  onSelect: (id: Id<"analyses"> | "new") => void;
}

export function AnalysisSidebar({ analyses, currentAnalysis, selectedId, onSelect }: AnalysisSidebarProps) {
  return (
    <aside className="w-full lg:w-[380px] flex-shrink-0 p-4 bg-gray-900/50 border-l-2 border-gray-700/50 rounded-lg h-[calc(100vh-250px)] overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-4 px-2">Analysis History</h2>
      <div className="space-y-2">
        {/* New analysis result, shown only when it exists */}
        {currentAnalysis && (
          <div
            onClick={() => onSelect("new")}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors border-2",
              selectedId === "new"
                ? "bg-purple-500/20 border-purple-500"
                : "bg-gray-800/60 border-transparent hover:bg-gray-700/50"
            )}
          >
            <div className="flex items-center gap-3">
               <Sparkles className="h-5 w-5 text-yellow-400 flex-shrink-0" />
               <div>
                <p className="font-semibold text-white">New Analysis Result</p>
                <p className="text-sm text-gray-400">Score: {currentAnalysis.overall_score}</p>
               </div>
            </div>
          </div>
        )}
        
        {/* Historical analyses */}
        {analyses?.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelect(item._id)}
            className={cn(
              "p-3 rounded-lg cursor-pointer transition-colors border-2",
              selectedId === item._id
                ? "bg-purple-500/20 border-purple-500"
                : "bg-gray-800/60 border-transparent hover:bg-gray-700/50"
            )}
          >
             <div className="flex items-center gap-3">
               <FileClock className="h-5 w-5 text-gray-400 flex-shrink-0" />
               <div>
                <p className="font-medium text-gray-200 line-clamp-1" title={item.jobDescription}>
                  {item.jobDescription || "General Analysis"}
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-4 mt-1">
                    <span>Score: {item.overallScore}</span>
                    <span>{new Date(item._creationTime).toLocaleDateString()}</span>
                </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}