'use client';

import { useState } from 'react';
import Link from "next/link";
import { User, Lock, ArrowRight, Gamepad2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/play');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#1a1a1a] font-press">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gamepad2 className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pixel-bounce" />
          <h1 className="text-2xl text-white">PLAYER LOGIN</h1>
        </div>

        <form onSubmit={handleLogin} className="pixel-panel space-y-6">
          {error && <p className="text-red-500 text-[10px] uppercase text-center">{error}</p>}
          
          <div className="space-y-2">
            <label className="block text-[10px] text-gray-400 uppercase">Email Address</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border-4 border-black p-3 pl-10 text-xs text-white focus:outline-none focus:border-yellow-400"
                placeholder="mario@nintendo.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] text-gray-400 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border-4 border-black p-3 pl-10 text-xs text-white focus:outline-none focus:border-yellow-400"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full pixel-button flex items-center justify-center gap-2"
          >
            {loading ? 'LOADING...' : 'CONTINUE'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center space-y-4">
            <p className="text-[8px] text-gray-500 uppercase">
              Don't have an account? 
              <Link href="/auth/register" className="text-yellow-400 ml-1 hover:underline">Register</Link>
            </p>
            <div className="border-t-2 border-black/20 pt-4">
              <Link href="/play" className="text-[8px] text-blue-400 hover:underline uppercase">
                Play as Guest (Scores not saved)
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
