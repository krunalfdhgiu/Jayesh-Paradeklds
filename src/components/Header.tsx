import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <nav className="hidden md:flex justify-between items-center w-full px-6 h-14 glass-card sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-6">
        <div className="text-xl font-800 tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent shrink-0">
          FANFEAST AI
        </div>
        <div className="flex gap-4 text-sm font-medium text-white/60">
          <a
            className="text-white border-b-2 border-blue-500 pb-1 transition-transform"
            href="#"
          >
            Live Match
          </a>
          <a
            className="hover:text-white transition-colors duration-300 px-2 rounded-md"
            href="#"
          >
            Watch Party
          </a>
          <a
            className="hover:text-white transition-colors duration-300 px-2 rounded-md"
            href="#"
          >
            Food Deals
          </a>
          <a
            className="hover:text-white transition-colors duration-300 px-2 rounded-md"
            href="#"
          >
            Fan Zone
          </a>
          <a
            className="hover:text-white transition-colors duration-300 px-2 rounded-md"
            href="#"
          >
            Rewards
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4 text-[#00f2ff]">
        <span className="hover:bg-white/10 transition-all duration-300 p-2 rounded-full cursor-pointer">
          <Search size={20} />
        </span>
        <span className="hover:bg-white/10 transition-all duration-300 p-2 rounded-full cursor-pointer relative">
          <Bell size={20} />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full live-pulse"></span>
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 overflow-hidden flex items-center justify-center">
            <span className="text-xs font-bold text-white">PF</span>
        </div>
      </div>
    </nav>
  );
}
