import type { AxiosError } from 'axios';

import type { LoginErrorResponse, VerifyOtpErrorResponse } from '@/api/auth';

type LoginFormErrors = {
  country?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
};

export function mapLoginServerError(error: unknown): LoginFormErrors {
  const axiosError = error as AxiosError<LoginErrorResponse>;
  const errorData = axiosError.response?.data;
  const field = errorData?.data?.field;
  const message = errorData?.message ?? 'Login failed';

  if (field === 'password') {
    return { password: message };
  }

  if (field === 'email') {
    return { email: message };
  }

  if (field === 'phone') {
    return { phoneNumber: message };
  }

  return { password: message };
}

export function getOtpErrorMessage(error: unknown) {
  const axiosError = error as AxiosError<VerifyOtpErrorResponse>;

  return axiosError.response?.data?.message ?? 'Invalid OTP';
}
