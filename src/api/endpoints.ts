export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? '/api/v1' : 'https://fe-technical-assignment.dxtr.asia/api/v1');

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
  },
  countries: {
    list: '/countries',
  },
  markets: {
    list: '/list-crypto',
  },
} as const;
