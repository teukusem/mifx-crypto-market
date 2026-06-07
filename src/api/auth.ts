import { useMutation } from '@tanstack/react-query';

import { apiEndpoints } from '@/api/endpoints';
import { httpClient } from '@/api/httpClient';

type PhoneLoginRequest = {
  phone: string;
  password: string;
};

type EmailLoginRequest = {
  email: string;
  password: string;
};

export type LoginRequest = PhoneLoginRequest | EmailLoginRequest;

export type LoginResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: {
    otp: string;
    email: string;
    phone?: string;
    token: string;
  };
};

export type VerifyOtpRequest = {
  otp: string;
  phone: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  status_code: number;
  message: string;
  data: Record<string, never>;
};

export type VerifyOtpErrorResponse = {
  success: false;
  message: string;
  status_code: number;
  data: Record<string, never>;
};

export type LoginErrorField = 'password' | 'email' | 'phone';

export type LoginErrorResponse = {
  success: false;
  message: string;
  status_code: number;
  data: {
    field: LoginErrorField;
  };
};

export async function login(payload: LoginRequest) {
  const response = await httpClient.post<LoginResponse>(apiEndpoints.auth.login, payload);

  return response.data;
}

export async function verifyOtp(payload: VerifyOtpRequest) {
  const response = await httpClient.post<VerifyOtpResponse>(
    apiEndpoints.auth.verifyOtp,
    payload,
  );

  return response.data;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: login,
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: verifyOtp,
  });
}
