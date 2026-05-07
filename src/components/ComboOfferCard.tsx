import { useState } from "react";
import { Zap, ExternalLink } from "lucide-react";
import { recommendCombo, calculateFoodIntent, calculateFanEnergy } from "../utils/logic";

function getZomatoSearchQuery(combo: { name: string; items: string }) {
  const name = combo?.name || "";
  const items = combo?.items || "";

  const text = `${name} ${items}`.toLowerCase();

  if (text.includes("pizza")) return "pizza fries cold drinks";
  if (text.includes("nachos")) return "nachos popcorn drinks";
  if (text.includes("burger") && text.includes("mocktail")) return "burger fries mocktails";
  if (text.includes("burger")) return "burger fries drinks family pack";

  return "cricket match snacks";
}

function buildZomatoSearchUrl(combo: { name: string; items: string }, city = "bengaluru") {
  const query = encodeURIComponent(getZomatoSearchQuery(combo));
  return `https://www.zomato.com/${city}/restaurants?q=${query}`;
}

export function ComboOfferCard({ matchData }: { matchData: any }) {
    const [orderMessage, setOrderMessage] = useState("");
    const { probability } = calculateFoodIntent(matchData);
    const fanEnergy = calculateFanEnergy(matchData);
    const { combo, description, discount, window: offerWindow, confidence } = recommendCombo(
        probability, 
        matchData?.matchPhase || '', 
        fanEnergy
    );

    function openZomatoForCombo() {
        const comboObj = { name: combo, items: description };
        const url = buildZomatoSearchUrl(comboObj, "bengaluru");
        const opened = window.open(url, "_blank", "noopener,noreferrer");

        if (!opened) {
            setOrderMessage("Please allow pop-ups to continue ordering on Zomato.");
        } else {
            setOrderMessage("Opening Zomato for your match combo...");
        }
    }

    return (
        <div className="glass-card p-5 border-l-4 border-l-orange-500 shrink-0 h-full flex flex-col justify-between group">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider">Match Combo</h3>
                    <p className="text-[10px] text-white/40">Probability Spike Detected</p>
                </div>
                <div className="text-2xl font-black text-orange-400 flex items-center gap-1">
                    <Zap className="w-5 h-5 -mt-0.5" /> {Math.round(confidence)}%
                </div>
            </div>
            
            <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20 mb-4 flex-1">
                <p className="text-[11px] leading-relaxed text-orange-100">
                    High intent window: {offerWindow}. Perfect time to order before the rush!
                </p>
            </div>
            
            <div className="p-3 glass-card bg-white/5 rounded-xl border-dashed border-white/20">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-xs font-bold">{combo}</p>
                    <span className="text-[10px] bg-green-500 text-black px-1.5 py-0.5 rounded font-black">
                        {discount}
                    </span>
                </div>
                <p className="text-[10px] text-white/60 mb-3">{description}</p>
                
                <button 
                  onClick={openZomatoForCombo}
                  className="w-full py-2 bg-[#E23744] hover:bg-[#C92936] rounded-lg text-xs font-bold text-white transition-colors flex items-center justify-center gap-2">
                    Order with Zomato
                    <ExternalLink className="w-3 h-3" />
                </button>
                <div className="mt-2 text-center text-[9px] text-white/50">
                    Complete your order securely on Zomato
                </div>
                {orderMessage && (
                    <div className="mt-2 text-center text-[10px] text-orange-300">
                        {orderMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
