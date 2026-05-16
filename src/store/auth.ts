import { create } from 'zustand';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithLine: () => void;
  logout: () => Promise<void>;
  clearError: () => void;
  initAuth: () => () => void; // returns unsubscribe
}

// LINE Login config (set in .env)
const LINE_CHANNEL_ID = import.meta.env.VITE_LINE_CHANNEL_ID || '';
const LINE_REDIRECT_URI = import.meta.env.VITE_LINE_REDIRECT_URI || `${window.location.origin}/account`;

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  error: null,

  signInWithGoogle: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      set({ error: message, loading: false });
    }
  },

  signInWithLine: () => {
    // LINE Login OAuth 2.0 redirect flow
    const state = crypto.randomUUID();
    sessionStorage.setItem('line_login_state', state);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: LINE_CHANNEL_ID,
      redirect_uri: LINE_REDIRECT_URI,
      state,
      scope: 'profile openid email',
    });

    window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
  },

  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ user: null, loading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      set({ error: message, loading: false });
    }
  },

  clearError: () => set({ error: null }),

  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
    return unsubscribe;
  },
}));
