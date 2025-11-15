// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Extract just the URL from the connection string
const supabaseUrl = 'https://ksbgplhktuxqnhhjmjdo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || '');

// Initialize storage bucket
export const initializeStorage = async () => {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'wish-images');
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error } = await supabase.storage.createBucket('wish-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
      });
      
      if (error) {
        console.error('Error creating storage bucket:', error);
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Auth helpers
export const signUp = async (email: string, password: string, username: string, region: string) => {
  try {
    // First, sign up the user
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

    // Then create the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username,
        region,
        is_premium: false,
        google_auth_enabled: false
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't throw, as auth user was created successfully
    }
    
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

// Initialize storage on module load
initializeStorage();