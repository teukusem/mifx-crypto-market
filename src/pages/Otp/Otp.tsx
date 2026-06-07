import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyOtpMutation } from '@/api/auth';
import { Button } from '@/components/Button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/InputOTP';
import { AuthLayout } from '@/components/AuthLayout';
import { Skeleton } from '@/components/Skeleton';
import { getOtpErrorMessage } from '@/pages/Login/authErrors';
import { useLoginStore } from '@/pages/Login/loginStore';
import { otpSchema } from './otpSchema';

export function Otp() {
  const navigate = useNavigate();
  const verifyOtpMutation = useVerifyOtpMutation();
  const { mode, otpChallenge } = useLoginStore();
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (!otpChallenge) {
      navigate('/login', { replace: true });
    }
  }, [navigate, otpChallenge]);

  if (!otpChallenge) {
    return null;
  }

  const challenge = otpChallenge;

  const otpRecipient =
    mode === 'email' ? challenge.targetLabel || 'your registered phone' : challenge.targetLabel;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = otpSchema.safeParse({ code: otpCode });

    if (!result.success) {
      setOtpError(result.error.issues[0]?.message ?? 'Enter the 6 digit code');
      return;
    }

    if (!challenge.phone) {
      setOtpError('Phone number is missing');
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        otp: otpCode,
        phone: challenge.phone,
      });

      setOtpError('');
      navigate('/home');
    } catch (error) {
      setOtpError(getOtpErrorMessage(error));
    }
  }

  return (
    <AuthLayout
      illustrationSrc="/images/illustration-otp.png"
      illustrationAlt="OTP confirmation illustration"
      contentClassName="mt-0 w-[min(100%,406px)] md:mt-0.5"
      progressClassName="w-[50vw] md:w-64"
    >
      <div className="mb-[38px] text-center">
        <h1 className="m-0 text-[34px] font-bold leading-[1.18] tracking-normal text-foreground max-[560px]:text-[28px]">
          Confirm your phone
        </h1>
        <p className="mt-3 text-base leading-[1.45] text-foreground">
          We send 6 digits code to {otpRecipient}
        </p>
      </div>

      <form className="grid gap-3.5" noValidate onSubmit={handleSubmit}>
        {verifyOtpMutation.isPending ? (
          <div
            className="grid grid-cols-6 gap-2 min-[561px]:grid-cols-[repeat(6,50px)] min-[561px]:gap-[13px]"
            aria-busy="true"
            aria-label="Verifying OTP"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-16 w-full rounded min-[561px]:h-[72px] min-[561px]:w-[50px]"
              />
            ))}
          </div>
        ) : (
        <InputOTP
          maxLength={6}
          value={otpCode}
          onChange={(value) => {
            setOtpCode(value);
            setOtpError('');
          }}
          containerClassName="justify-center"
        >
          <InputOTPGroup className="grid grid-cols-6 gap-2 min-[561px]:grid-cols-[repeat(6,50px)] min-[561px]:gap-[13px]">
            {Array.from({ length: 6 }).map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="relative h-16 w-full rounded first:rounded last:rounded border border-input bg-background text-2xl font-bold text-primary shadow-none after:absolute after:bottom-[9px] after:left-[11px] after:right-[11px] after:h-0.5 after:bg-input after:content-[''] data-[active=true]:border-input data-[active=true]:ring-0 data-[active=true]:after:bg-primary aria-invalid:!border-destructive min-[561px]:h-[72px] min-[561px]:w-[50px] min-[561px]:text-[28px] [&:not(:empty)]:after:bg-primary"
                aria-invalid={Boolean(otpError)}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        )}

        {otpError ? (
          <p className="m-0 text-center text-[13px] font-normal text-destructive">{otpError}</p>
        ) : null}

        <Button
          type="submit"
          disabled={verifyOtpMutation.isPending}
          className="mt-7 h-[42px] min-h-[42px] w-full rounded bg-primary text-base font-bold text-primary-foreground shadow-none hover:bg-primary disabled:opacity-70"
        >
          {verifyOtpMutation.isPending ? 'Loading...' : 'Confirm'}
        </Button>
      </form>
    </AuthLayout>
  );
}
