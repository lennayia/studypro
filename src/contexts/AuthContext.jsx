import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Načtení aktuálního uživatele při startu
  useEffect(() => {
    checkUser();

    // Listener pro změny auth stavu
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      console.log('Loading profile for user:', userId);

      // Timeout pro databázový dotaz (2 sekundy)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database timeout')), 2000)
      );

      const queryPromise = supabase
        .from('studypro_users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise])
        .catch(err => {
          console.warn('Database query failed or timed out:', err);
          return { data: null, error: err };
        });

      console.log('Profile query result:', { data, error });

      if (data) {
        // Máme data z databáze - použijeme je
        setProfile(data);
      } else {
        // Chyba nebo timeout - použijeme základní profil bez dalších dotazů
        console.log('Using fallback profile');
        setProfile({
          id: userId,
          email: 'loading...',
          full_name: 'User',
          total_points: 0,
          current_level: 1,
          study_streak: 0,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      // Vytvoříme základní profil aby aplikace fungovala
      setProfile({
        id: userId,
        email: 'user@example.com',
        full_name: 'User',
        total_points: 0,
        current_level: 1,
        study_streak: 0,
      });
    }
  };

  const createUserProfile = async (userId) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      const newProfile = {
        id: userId,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
        avatar_url: authUser.user_metadata?.avatar_url,
        auth_provider: 'google',
      };

      const { data, error } = await supabase
        .from('studypro_users')
        .insert([newProfile])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.message);
    }
  };

  // Přihlášení přes Google
  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);
      throw error;
    }
  };

  // Odhlášení
  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update profilu
  const updateProfile = async (updates) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from('studypro_users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    profile,
    loading,
    error,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
