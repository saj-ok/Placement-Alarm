import { Award, Star } from "lucide-react";

const ScoreCircle = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (score / 100) * circumference;
  
  const getScoreData = (score: number) => {
    if (score >= 90) return { color: "stroke-emerald-400", bgColor: "text-emerald-400", label: "Excellent", icon: Award };
    if (score >= 80) return { color: "stroke-green-400", bgColor: "text-green-400", label: "Very Good", icon: Star };
    if (score >= 70) return { color: "stroke-blue-400", bgColor: "text-blue-400", label: "Good", icon: Star };
    if (score >= 60) return { color: "stroke-yellow-400", bgColor: "text-yellow-400", label: "Fair", icon: Star };
    if (score >= 40) return { color: "stroke-orange-400", bgColor: "text-orange-400", label: "Below Average", icon: Star };
    return { color: "stroke-red-400", bgColor: "text-red-400", label: "Poor", icon: Star };
  };

  const scoreData = getScoreData(score);
  const IconComponent = scoreData.icon;

  return (
    <div className="relative flex items-center justify-center w-48 h-48">
      {/* Outer glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl"></div>
      
      {/* SVG Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle 
          className="text-slate-700/50" 
          strokeWidth="8" 
          stroke="currentColor" 
          fill="transparent" 
          r="50" 
          cx="60" 
          cy="60" 
        />
        
        {/* Progress circle */}
        <circle
          className={`${scoreData.color} transition-all duration-2000 ease-out`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
          style={{
            filter: 'drop-shadow(0 0 8px currentColor)',
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mb-2">
          <IconComponent className={`h-6 w-6 ${scoreData.bgColor}`} />
        </div>
        <span className="text-4xl font-bold text-white mb-1">{score}%</span>
        <span className={`text-sm font-medium ${scoreData.bgColor}`}>{scoreData.label}</span>
      </div>
      
      {/* Animated dots around the circle */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${scoreData.bgColor} rounded-full opacity-60`}
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 45}deg) translateY(-60px) translateX(-50%)`,
              animation: `pulse 2s ease-in-out infinite ${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ScoreCircle;