import { TrendingUp } from "lucide-react";
import { calculateFanEnergy, calculateFoodIntent } from "../utils/logic";

interface MatchPulseStripProps {
    matchData: any;
}

export function MatchPulseStrip({ matchData }: MatchPulseStripProps) {
    const timeline = matchData?.timeline || [];
    const lastEvent = timeline.length > 0 ? timeline[0].event : "-";
    const currentOverStr = timeline.length > 0 ? timeline.slice(0, 6).map((t: any) => t.event).join(" ") : "-";
    const fanEnergy = calculateFanEnergy(matchData);
    const { status: foodStatus } = calculateFoodIntent(matchData);

    return (
        <section className="grid grid-cols-3 md:grid-cols-6 gap-3 shrink-0">
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">Current Over</p>
                <p className="text-sm font-bold">{currentOverStr.substring(0,10) || "-"}</p>
            </div>
            
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">Last Event</p>
                <p className="text-sm font-bold uppercase">{lastEvent}</p>
            </div>
            
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">Run Rate</p>
                <p className="text-sm font-bold uppercase">{matchData?.requiredRunRate || matchData?.runRate || "-"}</p>
            </div>
            
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">Tension</p>
                <p className="text-sm font-bold text-orange-400 uppercase">Extreme</p>
            </div>
            
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">Fan Energy</p>
                <p className={`text-sm font-bold neon-text-green ${fanEnergy === "Electric" || fanEnergy === "High" ? "text-green-400" : "text-white"}`}>{fanEnergy}</p>
            </div>
            
            <div className="glass-card p-3 text-center space-y-1">
                <p className="text-[9px] text-white/40 uppercase">FoodMood</p>
                <p className="text-sm font-bold flex items-center justify-center gap-1">
                    {foodStatus.includes("High Object") || foodStatus.includes("High Intent") ? "Hungry" : "Stable"}
                </p>
            </div>
        </section>
    );
}
