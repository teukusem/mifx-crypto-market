import { create } from 'zustand';
import { defaultLoginCountry } from './countries';

export type LoginMode = 'email' | 'phone';

type LoginState = {
  mode: LoginMode;
  selectedCountryCode: string;
  email: string;
  phoneNumber: string;
  password: string;
  isPasswordVisible: boolean;
  setMode: (mode: LoginMode) => void;
  setSelectedCountryCode: (selectedCountryCode: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  togglePasswordVisibility: () => void;
};

export const useLoginStore = create<LoginState>((set) => ({
  mode: 'email',
  selectedCountryCode: defaultLoginCountry.code,
  email: '',
  phoneNumber: '',
  password: '',
  isPasswordVisible: false,
  setMode: (mode) => set({ mode }),
  setSelectedCountryCode: (selectedCountryCode) => set({ selectedCountryCode }),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
  togglePasswordVisibility: () =>
    set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),
}));
