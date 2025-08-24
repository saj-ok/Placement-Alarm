import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const CategoryScore = ({ category, score, explanation }: { category: string, score: number, explanation: string }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-blue-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getIcon = (score: number) => {
    if (score >= 70) return <TrendingUp className="h-4 w-4 text-green-400" />;
    if (score >= 40) return <Minus className="h-4 w-4 text-yellow-400" />;
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon(score)}
          <h5 className="font-semibold text-white text-sm">{category}</h5>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold text-lg ${getScoreColor(score)}`}>{score}</span>
          <span className="text-slate-400 text-sm">/100</span>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-slate-700/50 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${getProgressColor(score)}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 leading-relaxed">{explanation}</p>
    </div>
  );
};

export default CategoryScore;