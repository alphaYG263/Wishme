// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Use environment variable for Supabase URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ksbgplhktuxqnhhjmjdo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('❌ Missing VITE_SUPABASE_ANON_KEY environment variable!');
  throw new Error('Supabase configuration is incomplete');
}

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL environment variable!');
  throw new Error('Supabase configuration is incomplete');
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Supabase Key exists:', !!supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const signUp = async (email: string, password: string, username: string, region: string) => {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          region,
        }
      }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('No user data returned');

    // Wait for trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return authData;
  } catch (error) {
    console.error('SignUp error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};