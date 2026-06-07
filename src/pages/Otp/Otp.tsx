import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/components/Button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/InputOTP';
import { AuthLayout } from '@/components/AuthLayout';
import { getLoginCountryByCode } from '@/pages/Login/countries';
import { useLoginStore } from '@/pages/Login/loginStore';

export function Otp() {
  const { mode, selectedCountryCode, phoneNumber } = useLoginStore();
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');

  const selectedCountry = useMemo(
    () => getLoginCountryByCode(selectedCountryCode),
    [selectedCountryCode],
  );
  const otpRecipient =
    mode === 'email' ? 'your registered phone' : `${selectedCountry.dialCode} ${phoneNumber.trim()}`;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otpCode.length < 6) {
      setOtpError('Enter the 6 digit code');
      return;
    }

    setOtpError('');
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

        {otpError ? (
          <p className="m-0 text-center text-[13px] font-normal text-destructive">{otpError}</p>
        ) : null}

        <Button
          type="submit"
          className="mt-7 h-[42px] min-h-[42px] w-full rounded bg-primary text-base font-bold text-primary-foreground shadow-none hover:bg-primary"
        >
          Confirm
        </Button>
      </form>
    </AuthLayout>
  );
}
