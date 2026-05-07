export function AIInsights() {
    return (
        <section className="glass-card p-5">
            <h3 className="text-sm font-bold uppercase mb-4">AI Insights</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Active Fans</div>
                    <div className="text-sm font-bold text-blue-400">425k</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Fan Energy</div>
                    <div className="text-sm font-bold text-green-400">Electric</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Food Intent</div>
                    <div className="text-sm font-bold text-orange-400">82%</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Offer Interest</div>
                    <div className="text-sm font-bold text-white">High</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Predicted Orders</div>
                    <div className="text-sm font-bold text-white">12.4k</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <div className="text-[9px] text-white/40 uppercase mb-1">Rec. Confidence</div>
                    <div className="text-sm font-bold text-blue-400">91%</div>
                </div>
            </div>
        </section>
    );
}
