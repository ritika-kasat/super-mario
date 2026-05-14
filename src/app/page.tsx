import Link from "next/link";
import { Trophy, Play, User, Gamepad2 } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 pixel-border animate-pixel-bounce"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-red-500 pixel-border"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-8 bg-green-500 pixel-border"></div>
      </div>

      <div className="z-10 text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-press-start mb-4 text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)]">
          SUPER
          <br />
          MARIO
        </h1>
        
        <p className="font-press-start text-xs md:text-sm mb-12 text-gray-400 animate-pulse">
          PRESS START TO PLAY
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link href="/play" className="pixel-button flex items-center justify-center gap-3">
            <Play className="w-5 h-5" />
            Play Game
          </Link>
          <Link href="/leaderboard" className="pixel-button bg-blue-600 hover:bg-blue-500 shadow-[inset_-4px_-4px_0_0_#2980b9,4px_4px_0_0_#000] flex items-center justify-center gap-3">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </Link>
          <Link href="/auth/login" className="pixel-button bg-green-600 hover:bg-green-500 shadow-[inset_-4px_-4px_0_0_#27ae60,4px_4px_0_0_#000] flex items-center justify-center gap-3">
            <User className="w-5 h-5" />
            Login
          </Link>
          <Link href="/profile" className="pixel-button bg-purple-600 hover:bg-purple-500 shadow-[inset_-4px_-4px_0_0_#8e44ad,4px_4px_0_0_#000] flex items-center justify-center gap-3">
            <Gamepad2 className="w-5 h-5" />
            My Stats
          </Link>
        </div>

        <div className="mt-20 pixel-panel max-w-lg w-full">
          <h2 className="font-press-start text-lg mb-4 text-yellow-400">TOP 3 PLAYERS</h2>
          <div className="space-y-4">
            {[
              { rank: 1, name: "MarioMaster", score: 12500 },
              { rank: 2, name: "LuigiLover", score: 11200 },
              { rank: 3, name: "PeachPrincess", score: 9800 }
            ].map((player) => (
              <div key={player.rank} className="flex justify-between items-center font-press-start text-xs border-b border-gray-600 pb-2">
                <span className="flex items-center gap-2">
                  <span className={player.rank === 1 ? "text-yellow-400" : "text-gray-400"}>#{player.rank}</span>
                  {player.name}
                </span>
                <span className="text-green-400">{player.score}</span>
              </div>
            ))}
          </div>
          <Link href="/leaderboard" className="mt-6 block text-[10px] font-press-start text-blue-400 hover:underline">
            VIEW ALL RANKINGS
          </Link>
        </div>
      </div>

      <footer className="mt-12 font-press-start text-[8px] text-gray-600">
        © 2026 SUPER MARIO STUDIOS - BUILT WITH NEXT.JS & SUPABASE
      </footer>
    </main>
  );
}
