import { Gamepad2 } from "lucide-react";
import { recommendEngagement, calculateFanEnergy } from "../utils/logic";

export function EngagementCard({ matchData }: { matchData: any }) {
    const fanEnergy = calculateFanEnergy(matchData);
    const { title } = recommendEngagement(
        matchData?.matchPhase || '', 
        matchData?.lastEvent || matchData?.timeline?.[0]?.event || '', 
        fanEnergy,
        matchData?.status || ''
    );

    return (
        <div className="glass-card p-5 shrink-0 group">
            <h3 className="text-sm font-bold uppercase mb-4">Fan Engagement Zone</h3>
            
            <div className="space-y-3">
                <div className="p-3 glass-card hover:bg-white/10 transition-all cursor-pointer flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="text-lg">🎯</div>
                        <p className="text-xs font-semibold">{title}</p>
                    </div>
                    <span className="text-blue-400">→</span>
                </div>
            </div>
            
            <button className="w-full mt-4 py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-white/5 transition-colors">
                View All Challenges
            </button>
        </div>
    );
}
