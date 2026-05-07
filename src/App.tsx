import { useEffect, useState, useRef } from "react";
import { Header } from "./components/Header";
import { LiveMatchHero } from "./components/LiveMatchHero";
import { MatchPulseStrip } from "./components/MatchPulseStrip";
import { FoodPredictionCard } from "./components/FoodPredictionCard";
import { ComboOfferCard } from "./components/ComboOfferCard";
import { EngagementCard } from "./components/EngagementCard";
import { WatchPartyRooms } from "./components/WatchPartyRooms";
import { AIInsights } from "./components/AIInsights";
import { MatchTimeline } from "./components/MatchTimeline";
import { EmptyLiveState } from "./components/EmptyLiveState";
import { Tv, Users, Utensils, Activity, Trophy } from "lucide-react";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchMatchData = async (isBackground = false) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      
      if (isBackground) {
        setIsRefreshing(true);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch('/api/live-match?ts=' + Date.now(), { 
            signal: controller.signal,
            cache: 'no-store'
        });
        if (!response.ok) {
          throw new Error('Response not ok');
        }
        
        const result = await response.json();
        setData((prevData: any) => {
            if (!prevData || prevData.lastBallKey !== result.lastBallKey) {
                return result;
            }
            return prevData;
        });
        setError(false);
      } catch (err: any) {
        setError(true);
        // Only set default if we have no data at all
        setData((prevData: any) => {
            if (prevData) return prevData;
            return {
              hasLiveMatch: false,
              message: "LSG vs RCB live moments will appear here when the match action begins.",
              matchName: "LSG vs RCB",
              teamA: "Lucknow Super Giants",
              teamB: "Royal Challengers Bengaluru",
              scoreText: "Live score coming in",
              overs: "Live update",
              wickets: "Live update",
              runRate: "Live update",
              requiredRunRate: "Live update",
              currentBatter: "Live update coming in",
              currentBowler: "Live update coming in",
              venue: "Live venue update",
              matchPhase: "Live Match",
              lastEvent: "Live Moment",
              status: "Live match action will appear here soon",
              timeline: [],
              lastBallKey: "default-state-key"
            };
        });
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
        setIsRefreshing(false);
        isFetchingRef.current = false;
      }
    };

    fetchMatchData();
    
    const interval = setInterval(() => fetchMatchData(true), 15000);
    
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            fetchMatchData(true);
        }
    };
    
    const handleFocus = () => {
        fetchMatchData(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
        clearInterval(interval);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!data) {
    return null; // Should not happen but typescript needs it
  }

  return (
    <div className="min-h-screen font-sans antialiased relative">
      <Header />
      
      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden glass-card rounded-t-xl border-t border-white/10">
        <a className="flex flex-col items-center justify-center text-[#00f2ff] active:scale-95 duration-200" href="#">
          <Tv size={20} />
          <span className="text-[10px] font-medium mt-1">Live</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 duration-200" href="#">
          <Users size={20} />
          <span className="text-[10px] font-medium mt-1">Parties</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 duration-200" href="#">
          <Utensils size={20} />
          <span className="text-[10px] font-medium mt-1">Food</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 duration-200" href="#">
          <Activity size={20} />
          <span className="text-[10px] font-medium mt-1">Pulse</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 hover:text-white transition-all active:scale-95 duration-200" href="#">
          <Trophy size={20} />
          <span className="text-[10px] font-medium mt-1">Rewards</span>
        </a>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-12 pb-32 md:pb-12">
        {data.hasLiveMatch ? (
          <LiveMatchHero matchData={data} />
        ) : (
          <EmptyLiveState />
        )}
        
        <MatchPulseStrip matchData={data} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FoodPredictionCard matchData={data} />
            <ComboOfferCard matchData={data} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-12">
                <WatchPartyRooms parties={data.parties || []} />
                <AIInsights />
            </div>
            
            <div className="space-y-6">
                <EngagementCard matchData={data} />
                <MatchTimeline timeline={data.timeline} />
            </div>
        </div>
      </main>

      {isRefreshing && (
        <div className="fixed bottom-4 right-4 bg-blue-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-lg border border-blue-500/30 text-xs font-medium z-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            Catching the latest match moment...
        </div>
      )}
    </div>
  );
}
