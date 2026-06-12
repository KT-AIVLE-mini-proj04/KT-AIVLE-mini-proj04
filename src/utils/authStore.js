const KEYS = { token: 'accessToken', user: 'authUser' };

const parse = (key) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
};

const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn());

const store = {
  getAccessToken: () => localStorage.getItem(KEYS.token) ?? null,
  setAccessToken: (token) => {
    if (token == null) localStorage.removeItem(KEYS.token);
    else localStorage.setItem(KEYS.token, token);
    notify();
  },
  clearAccessToken: () => {
    localStorage.removeItem(KEYS.token);
    notify();
  },

  getUser: () => parse(KEYS.user),
  setUser: (user) => {
    if (user == null) localStorage.removeItem(KEYS.user);
    else localStorage.setItem(KEYS.user, JSON.stringify(user));
    notify();
  },
  clearUser: () => {
    localStorage.removeItem(KEYS.user);
    notify();
  },

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

// 훅 밖 (interceptor 등)에서 사용
export const getAccessToken = () => store.getAccessToken();
export const setAccessToken = (token) => store.setAccessToken(token);
export const clearAccessToken = () => store.clearAccessToken();

export const getUser = () => store.getUser();
export const setUser = (user) => store.setUser(user);
export const clearUser = () => store.clearUser();

// 컴포넌트/훅 안에서 사용
import { useSyncExternalStore } from 'react';

export const hookAccessToken = () =>
  useSyncExternalStore(store.subscribe, store.getAccessToken);
export const hookSetAccessToken = () => store.setAccessToken;
export const hookUser = () =>
  useSyncExternalStore(store.subscribe, store.getUser);
export const hookSetUser = () => store.setUser;
