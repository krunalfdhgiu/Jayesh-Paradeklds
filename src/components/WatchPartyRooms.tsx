import { Video } from "lucide-react";

export function WatchPartyRooms({ parties }: { parties: any[] }) {
    if (!parties) return null;

    return (
        <section className="mb-0">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider">Active Watch Parties</h3>
                <span className="text-[10px] text-blue-400 font-bold">8.4k Fans Live</span>
            </div>
            
            <div className="flex flex-col gap-4 pb-4">
                {parties.map((party) => (
                    <div key={party.id} className="glass-card bg-white/5 p-4 flex justify-between items-center transition-colors hover:border-blue-500/50 cursor-pointer">
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 grid place-items-center">
                                <Video size={16} className="text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold">{party.name}</p>
                                <p className="text-[10px] text-white/40">Energy: {party.energy}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold">{party.fans}</p>
                            <p className="text-[9px] text-green-400 uppercase">{party.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
