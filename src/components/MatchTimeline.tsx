export function MatchTimeline({ timeline }: { timeline: any[] }) {
    if (!timeline || timeline.length === 0) return null;

    return (
        <section className="flex-1 glass-card p-5 flex flex-col min-h-0">
            <h3 className="text-sm font-bold uppercase mb-4 shrink-0">Match Pulse Timeline</h3>
            <div className="space-y-4 overflow-hidden opacity-80">
                {timeline.map((item, index) => (
                    <div key={index} className={`flex gap-4 items-start ${index > 0 ? (index > 1 ? 'opacity-40' : 'opacity-60') : ''}`}>
                        <div className={`w-8 py-1 rounded text-center text-[10px] font-bold shrink-0 ${index === 0 ? 'bg-blue-500/20 text-blue-400' : (index % 2 === 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10')}`}>
                            {item.over}
                        </div>
                        <div className="text-[11px]">
                            <span className="font-bold block">{item.event}{item.event === 'W' ? 'ICKET' : ''}!</span> 
                            {item.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
