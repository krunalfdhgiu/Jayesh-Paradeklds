import { Utensils, Sparkles } from "lucide-react";
import { calculateFoodIntent } from "../utils/logic";

export function FoodPredictionCard({ matchData }: { matchData: any }) {
    const { probability, status, reason } = calculateFoodIntent(matchData);

    return (
        <div className="glass-card rounded-[1.25rem] p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between group neon-border-blue transition-colors duration-500">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-blue-400 w-6 h-6" />
                        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">AI Food Moment</h2>
                    </div>
                    <p className="text-xs text-white/50 max-w-md">{reason}</p>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-black text-orange-400">
                        {Math.round(probability)}%
                    </div>
                    <div className="font-bold text-[10px] text-white/40 uppercase tracking-widest mt-1">
                        {status}
                    </div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                <span className="glass-card text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-md">
                    Timeout Window
                </span>
                <span className="glass-card text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-md">
                    Group Size: 6
                </span>
                <span className="glass-card text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-md">
                    Evening Match
                </span>
                <span className="glass-card text-white/60 text-[10px] font-bold px-3 py-1.5 rounded-md">
                    High Excitement
                </span>
            </div>
            
            <button className="w-full lg:w-auto self-start bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 relative z-10">
                <Utensils size={18} />
                View Food Suggestion
            </button>
        </div>
    );
}
