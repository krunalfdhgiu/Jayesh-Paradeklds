import { Users, Sparkles } from "lucide-react";

interface LiveMatchHeroProps {
    matchData: any;
}

export function LiveMatchHero({ matchData }: LiveMatchHeroProps) {
  return (
    <section className="relative rounded-[1.25rem] overflow-hidden glass-card neon-border-blue min-h-[400px] flex flex-col justify-end p-8 shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -z-10"></div>
      
      <div className="relative w-full flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
              <div className="live-pulse w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">LIVE</span>
            </div>
            <span className="glass-card text-white font-bold px-3 py-1 rounded-full text-sm">
              {matchData.venue}
            </span>
            <span className="glass-card text-white font-bold px-3 py-1 rounded-full text-sm">
              {matchData.matchPhase}
            </span>
          </div>

          {matchData.status && matchData.status !== "Match ongoing" && (
            <div className="mb-4 inline-block bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 px-4 py-2 rounded-lg text-sm font-semibold animate-pulse">
              ⚠️ {matchData.status}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
            {matchData.matchName}
          </h1>
          
          <div className="flex items-baseline gap-4 mb-4">
            <div className="text-5xl md:text-6xl font-black text-white">
              {matchData.scoreText}
            </div>
            <div className="text-2xl font-normal text-white/50">
              ({matchData.overs})
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/60 font-medium">
            <div>
              <span className="uppercase">Req. RR:</span>{" "}
              <span className="font-bold text-[#00f2ff]">{matchData.requiredRunRate}</span>
            </div>
            <div>
              <span className="uppercase">Batter:</span>{" "}
              <span className="font-bold text-white">{matchData.currentBatter}</span>
            </div>
            <div>
              <span className="uppercase">Bowler:</span>{" "}
              <span className="font-bold text-white">{matchData.currentBowler}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="uppercase">Last Ball:</span>
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                {matchData.lastEvent?.charAt(0) || "-"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col gap-3">
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <Users size={20} />
            Join Watch Party
          </button>
          <button className="w-full glass-card hover:bg-white/5 transition-colors font-bold py-4 rounded-xl text-white flex items-center justify-center gap-2">
            <Sparkles size={20} />
            View AI Insights
          </button>
        </div>
      </div>
    </section>
  );
}
