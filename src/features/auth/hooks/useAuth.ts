import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as authSignOut,
  resetPassword as authResetPassword,
  getSession,
  getProfile,
  mapProfileToUser,
  onAuthStateChange,
} from '../services/authService';

export function useAuth() {
  const { user, isLoading, isAuthenticated, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function loadInitialSession() {
      try {
        const session = await getSession();
        if (!mounted) return;

        if (session?.user) {
          const profile = await getProfile(session.user.id);
          if (!mounted) return;
          setUser(mapProfileToUser(profile, session.user));
        } else {
          setUser(null);
        }
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInitialSession();

    const subscription = onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session?.user) {
        logout();
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const profile = await getProfile(session.user.id);
        if (!mounted) return;
        setUser(mapProfileToUser(profile, session.user));
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUser, setLoading, logout]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      // Auth state change listener handles the rest
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [setLoading]);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    try {
      await signUpWithEmail(email, password, displayName);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  }, [setLoading]);

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      // Auth state change listener handles cleanup
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const resetPassword = useCallback(async (email: string) => {
    await authResetPassword(email);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
