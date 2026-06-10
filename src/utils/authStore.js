import { create } from 'zustand';

const hookAuthStore = create((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),

  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// 컴포넌트/훅 안에서 사용
export const hookAccessToken = () => hookAuthStore((state) => state.accessToken);
export const hookSetAccessToken = () => hookAuthStore((state) => state.setAccessToken);
export const hookUser = () => hookAuthStore((state) => state.user);
export const hookSetUser = () => hookAuthStore((state) => state.setUser);

// 훅 밖 (interceptor 등)에서 사용
export const getAccessToken = () => hookAuthStore.getState().accessToken;
export const setAccessToken = (token) => hookAuthStore.getState().setAccessToken(token);
export const clearAccessToken = () => hookAuthStore.getState().clearAccessToken();

export const getUser = () => hookAuthStore.getState().user;
export const setUser = (user) => hookAuthStore.getState().setUser(user);
export const clearUser = () => hookAuthStore.getState().clearUser();

