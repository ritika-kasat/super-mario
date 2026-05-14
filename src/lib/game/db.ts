import { supabase } from '../supabase';

export const saveScore = async (userId: string, score: number, distance: number, coins: number) => {
  const { data, error } = await supabase
    .from('scores')
    .insert([
      { user_id: userId, score, distance, coins_collected: coins }
    ]);
  
  if (error) throw error;
  return data;
};

export const getLeaderboard = async (limit = 100) => {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, username: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, username });
  
  if (error) throw error;
  return data;
};
