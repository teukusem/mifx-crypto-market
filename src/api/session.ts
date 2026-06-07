import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

const SESSION_STORAGE_KEY = 'mifx.session';
const SESSION_TTL_MS = 60 * 60 * 1000;

type SessionState = {
  token: string | null;
  expiresAt: number | null;
  setToken: (token: string) => void;
  clear: () => void;
};

export const sessionStore = createStore<SessionState>()(
  persist(
    (set) => ({
      token: null,
      expiresAt: null,
      setToken: (token) =>
        set({
          token,
          expiresAt: Date.now() + SESSION_TTL_MS,
        }),
      clear: () =>
        set({
          token: null,
          expiresAt: null,
        }),
    }),
    {
      name: SESSION_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        expiresAt: state.expiresAt,
      }),
    },
  ),
);

export function setSessionToken(token: string | null): void {
  if (token) {
    sessionStore.getState().setToken(token);
  } else {
    sessionStore.getState().clear();
  }
}

export function getSessionToken(): string | null {
  const { token, expiresAt, clear } = sessionStore.getState();

  if (!token || !expiresAt) {
    return null;
  }

  if (Date.now() >= expiresAt) {
    clear();
    return null;
  }

  return token;
}

export function clearSession(): void {
  sessionStore.getState().clear();
}
