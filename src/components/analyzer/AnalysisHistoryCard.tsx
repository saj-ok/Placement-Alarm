import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";

interface AnalysisHistoryCardProps {
  id: Id<"analyses">;
  score: number;
  jobDescription: string;
  createdAt: number; // Convex timestamps are numbers
}

export function AnalysisHistoryCard({ id, score, jobDescription, createdAt }: AnalysisHistoryCardProps) {
  const date = new Date(createdAt);

  const getScoreColor = (s: number) => {
    if (s > 75) return "text-green-400";
    if (s > 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700/60 hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg">
            <FileText className="h-5 w-5 text-gray-300" />
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}<span className="text-lg text-gray-400">/100</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-white font-semibold line-clamp-2" title={jobDescription}>
          {jobDescription || "General Analysis"}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{date.toLocaleDateString()}</span>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20">
          <Link href={`/analyzer/${id}`}>
            View Details <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}