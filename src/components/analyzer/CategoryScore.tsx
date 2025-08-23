const CategoryScore = ({ category, score, explanation }: { category: string, score: number, explanation: string }) => (
  <div className="p-4 bg-gray-900/50 rounded-lg">
    <div className="flex justify-between items-center mb-1">
      <h5 className="font-semibold text-white">{category}</h5>
      <span className="font-bold text-purple-400">{score}/100</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
    </div>
    <p className="text-sm text-slate-400 mt-2">{explanation}</p>
  </div>
);

export default CategoryScore;