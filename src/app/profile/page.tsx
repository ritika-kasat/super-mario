'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { User as UserIcon, Trophy, Calendar, Gamepad2, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      const [profileRes, historyRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('scores').select('*').eq('user_id', user.id).order('played_at', { ascending: false }).limit(5)
      ]);

      setProfile(profileRes.data);
      setHistory(historyRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] font-press">
        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
        <p className="text-xs text-gray-500">LOADING PROFILE...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-12 bg-[#1a1a1a] font-press">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="pixel-button bg-gray-600 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> BACK
          </Link>
          <h1 className="text-xl md:text-3xl text-white">PROFILE</h1>
          <button onClick={handleLogout} className="pixel-button bg-red-600 flex items-center gap-2">
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="pixel-panel text-center">
              <div className="w-24 h-24 bg-purple-500 pixel-border mx-auto mb-6 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-lg text-yellow-400 mb-2">{profile?.username || 'PLAYER'}</h2>
              <p className="text-[8px] text-gray-500 uppercase">Pro Player</p>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-[10px]">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>BEST: {Math.max(...history.map(s => s.score), 0)}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <Gamepad2 className="w-4 h-4 text-green-400" />
                  <span>GAMES: {history.length}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>JOINED: {new Date(profile?.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="pixel-panel h-full">
              <h3 className="text-sm mb-6 text-gray-400 uppercase">RECENT GAMES</h3>
              <div className="space-y-4">
                {history.length > 0 ? history.map((game) => (
                  <div key={game.id} className="flex justify-between items-center border-b-2 border-black/20 pb-4">
                    <div className="space-y-1">
                      <p className="text-xs text-white">SCORE: {game.score}</p>
                      <p className="text-[8px] text-gray-500 uppercase">
                        {game.distance}m | {game.coins_collected} COINS
                      </p>
                    </div>
                    <span className="text-[8px] text-gray-400 uppercase">
                      {new Date(game.played_at).toLocaleDateString()}
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-500 text-center py-10 uppercase">No games played yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
