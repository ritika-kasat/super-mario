'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Trophy, ArrowLeft, Loader2 } from "lucide-react";
import { getLeaderboard } from '@/lib/game/db';

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await getLeaderboard();
        setPlayers(data || []);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-[#1a1a1a] font-press">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="pixel-button bg-gray-600 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
          <h1 className="text-xl md:text-3xl text-yellow-400 flex items-center gap-4">
            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
            HALL OF FAME
          </h1>
          <div className="w-[100px] hidden md:block"></div>
        </div>

        <div className="pixel-panel">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
              <p className="text-xs text-gray-500">LOADING SCORES...</p>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button className="pixel-button text-[8px] bg-blue-600">ALL TIME</button>
                <button className="pixel-button text-[8px] bg-gray-700">WEEKLY</button>
                <button className="pixel-button text-[8px] bg-gray-700">DAILY</button>
              </div>

              <table className="w-full text-[10px] text-left">
                <thead>
                  <tr className="border-b-4 border-black text-gray-400">
                    <th className="py-4 px-2">RANK</th>
                    <th className="py-4 px-2">PLAYER</th>
                    <th className="py-4 px-2">SCORE</th>
                    <th className="py-4 px-2 hidden md:table-cell">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {players.length > 0 ? (
                    players.map((player, index) => (
                      <tr key={index} className="border-b-2 border-black/20 hover:bg-white/5 transition-colors">
                        <td className={`py-4 px-2 ${index < 3 ? 'text-yellow-400' : 'text-white'}`}>
                          #{index + 1}
                        </td>
                        <td className="py-4 px-2">{player.username}</td>
                        <td className="py-4 px-2 text-green-400">{player.high_score.toLocaleString()}</td>
                        <td className="py-4 px-2 text-gray-500 hidden md:table-cell">
                          {new Date(player.played_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-gray-500">NO SCORES YET. BE THE FIRST!</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="mt-8 text-center text-[8px] text-gray-500">
                SHOWING TOP {players.length} PLAYERS
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
