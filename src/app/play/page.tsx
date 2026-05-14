'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/game/engine';
import { Trophy, Home, RotateCcw, Pause, Play, Heart } from 'lucide-react';
import Link from 'next/link';
import { saveScore } from '@/lib/game/db';
import { supabase } from '@/lib/supabase';

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [finalStats, setFinalStats] = useState({ score: 0, coins: 0, distance: 0 });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new GameEngine(canvasRef.current, handleGameOver);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (engineRef.current) engineRef.current.handleInput(e.key, 'down');
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (engineRef.current) engineRef.current.handleInput(e.key, 'up');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (engineRef.current) engineRef.current.stop();
    };
  }, []);

  const handleGameOver = async (score: number, coins: number, distance: number) => {
    setGameState('gameover');
    setFinalStats({ score, coins, distance });
    
    if (user) {
      try {
        await saveScore(user.id, score, distance, coins);
      } catch (err) {
        console.error("Failed to save score:", err);
      }
    }
  };

  const startGame = () => {
    if (engineRef.current) {
      engineRef.current.start();
      setGameState('playing');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#1a1a1a] p-4 font-press">
      <div className="relative pixel-border bg-black overflow-hidden shadow-2xl">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={600} 
          className="max-w-full h-auto"
        />

        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <h2 className="text-4xl text-yellow-400 mb-8 animate-pixel-bounce">READY?</h2>
            {!user && (
              <p className="text-[8px] text-red-400 mb-4 uppercase">Playing as Guest - Scores won't be saved</p>
            )}
            <button onClick={startGame} className="pixel-button">START GAME</button>
            <p className="mt-8 text-[10px] text-gray-400 uppercase">Arrows/WASD to Move & Jump</p>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/90 z-30">
            <h2 className="text-5xl text-white mb-8">GAME OVER</h2>
            <div className="pixel-panel mb-8 text-center space-y-4">
              <p className="text-yellow-400">FINAL SCORE: {finalStats.score}</p>
              <p className="text-white text-xs">DISTANCE: {finalStats.distance}m</p>
              <p className="text-white text-xs">COINS: {finalStats.coins}</p>
            </div>
            <div className="flex gap-4">
              <button onClick={startGame} className="pixel-button bg-green-600">TRY AGAIN</button>
              <Link href="/leaderboard" className="pixel-button bg-blue-600">LEADERBOARD</Link>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
            <h2 className="text-4xl text-white mb-8">PAUSED</h2>
            <button onClick={() => setGameState('playing')} className="pixel-button bg-green-600">RESUME</button>
          </div>
        )}
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-[800px]">
        <Link href="/" className="pixel-button bg-gray-600 flex-1 flex justify-center items-center gap-2">
          <Home className="w-4 h-4" /> MENU
        </Link>
        <button 
          onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
          className="pixel-button bg-yellow-600 flex-1 flex justify-center items-center gap-2"
        >
          {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {gameState === 'playing' ? 'PAUSE' : 'PLAY'}
        </button>
        <button onClick={startGame} className="pixel-button bg-blue-600 flex-1 flex justify-center items-center gap-2">
          <RotateCcw className="w-4 h-4" /> RESET
        </button>
      </div>
    </main>
  );
}
