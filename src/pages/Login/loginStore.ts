import { create } from 'zustand';

export type LoginMode = 'email' | 'phone';

export type OtpChallenge = {
  targetLabel: string;
  phone: string | null;
  token: string;
};

type LoginState = {
  mode: LoginMode;
  selectedCountryCode: string;
  email: string;
  phoneNumber: string;
  password: string;
  isPasswordVisible: boolean;
  otpChallenge: OtpChallenge | null;
  setMode: (mode: LoginMode) => void;
  switchLoginMode: (mode: LoginMode) => void;
  setSelectedCountryCode: (selectedCountryCode: string) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setPassword: (password: string) => void;
  togglePasswordVisibility: () => void;
  setOtpChallenge: (challenge: OtpChallenge | null) => void;
  resetAuthFlow: () => void;
};

export const useLoginStore = create<LoginState>((set) => ({
  mode: 'phone',
  selectedCountryCode: '',
  email: '',
  phoneNumber: '',
  password: '',
  isPasswordVisible: false,
  otpChallenge: null,
  setMode: (mode) => set({ mode }),
  switchLoginMode: (mode) =>
    set({
      mode,
      email: '',
      phoneNumber: '',
      password: '',
      isPasswordVisible: false,
    }),
  setSelectedCountryCode: (selectedCountryCode) => set({ selectedCountryCode }),
  setEmail: (email) => set({ email }),
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setPassword: (password) => set({ password }),
  togglePasswordVisibility: () =>
    set((state) => ({ isPasswordVisible: !state.isPasswordVisible })),
  setOtpChallenge: (otpChallenge) => set({ otpChallenge }),
  resetAuthFlow: () =>
    set({
      otpChallenge: null,
    }),
}));
