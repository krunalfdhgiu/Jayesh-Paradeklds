import { Activity } from "lucide-react";

export function EmptyLiveState() {
    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-6 glass-card rounded-[1.25rem] neon-border-blue">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-2 border-blue-500 rounded-full animate-ping opacity-20"></div>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.5)]">
                    <Activity className="text-white w-6 h-6" />
                </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Live match is warming up.</h2>
            <p className="text-white/50 max-w-md mx-auto text-sm mb-8">
                LSG vs RCB live moments will appear here when the match action begins.
            </p>
            <button className="bg-blue-600 hover:bg-blue-500 font-bold py-3 px-8 rounded-lg transition-colors" onClick={() => window.location.reload()}>
                Refresh Status
            </button>
        </div>
    );
}
