'use client';

import { useState } from 'react';
import Link from "next/link";
import { User, Lock, ArrowRight, Gamepad2, Mail } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Sign up user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // 2. Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username }]);

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
      } else {
        router.push('/play');
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#1a1a1a] font-press">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Gamepad2 className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pixel-bounce" />
          <h1 className="text-2xl text-white">NEW PLAYER</h1>
        </div>

        <form onSubmit={handleRegister} className="pixel-panel space-y-6">
          {error && <p className="text-red-500 text-[10px] uppercase text-center">{error}</p>}

          <div className="space-y-2">
            <label className="block text-[10px] text-gray-400 uppercase">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border-4 border-black p-3 pl-10 text-xs text-white focus:outline-none focus:border-green-400"
                placeholder="PLAYER_1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] text-gray-400 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border-4 border-black p-3 pl-10 text-xs text-white focus:outline-none focus:border-green-400"
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
                className="w-full bg-black border-4 border-black p-3 pl-10 text-xs text-white focus:outline-none focus:border-green-400"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full pixel-button bg-green-600 shadow-[inset_-4px_-4px_0_0_#27ae60,4px_4px_0_0_#000] flex items-center justify-center gap-2"
          >
            {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <p className="text-[8px] text-gray-500 uppercase">
              Already have an account? 
              <Link href="/auth/login" className="text-yellow-400 ml-1 hover:underline">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
