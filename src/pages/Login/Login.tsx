import { FormEvent, useMemo, useState } from 'react';
import { Eye, EyeClosed } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Label } from '@/components/Label';
import { cn } from '@/utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select';
import { AuthLayout } from '@/components/AuthLayout';
import { getLoginCountryByCode, loginCountries } from './countries';
import { useLoginStore } from './loginStore';
import {
  emailFieldSchema,
  getFirstIssueMessage,
  getPhoneLoginErrors,
  passwordFieldSchema,
} from './loginSchema';

type LoginProps = {
  onLoginSuccess: () => void;
};

type FormErrors = {
  country?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
};

const fieldLabelClassName =
  'text-left align-middle text-xs font-normal leading-4 tracking-[0.4px] text-foreground';
const fieldErrorClassName = 'm-0 text-[13px] font-normal text-destructive';
const switchButtonClassName =
  'min-h-0 cursor-pointer border-0 bg-transparent p-0 text-right align-middle text-[12px] font-normal leading-4 tracking-[0.4px] text-primary hover:underline hover:underline-offset-3';
const inputClassName =
  'h-10 rounded border border-input bg-white px-4 text-base text-foreground shadow-none placeholder:text-[var(--app-placeholder)] focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/15 aria-invalid:!border-destructive aria-invalid:focus-visible:!border-destructive aria-invalid:focus-visible:ring-destructive/15';
const signInButtonClassName =
  'mt-1 h-10 min-h-10 w-full rounded bg-primary text-base font-bold text-primary-foreground shadow-none hover:bg-primary';

export function Login({ onLoginSuccess }: LoginProps) {
  const {
    mode,
    selectedCountryCode,
    email,
    phoneNumber,
    password,
    isPasswordVisible,
    setMode,
    setSelectedCountryCode,
    setEmail,
    setPhoneNumber,
    setPassword,
    togglePasswordVisibility,
  } = useLoginStore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasStartedPhoneValidation, setHasStartedPhoneValidation] = useState(false);

  const selectedCountry = useMemo(
    () => getLoginCountryByCode(selectedCountryCode),
    [selectedCountryCode],
  );
  const isEmailMode = mode === 'email';
  const illustrationSrc = isEmailMode
    ? '/images/illustration-email.png'
    : '/images/illustration-call-phone.png';

  const livePhoneErrors = useMemo(() => {
    if (isEmailMode) {
      return {};
    }

    return getPhoneLoginErrors({
      country: selectedCountryCode ? selectedCountry.dialCode : '',
      phoneNumber,
      dialCode: selectedCountryCode ? selectedCountry.dialCode : undefined,
    });
  }, [isEmailMode, phoneNumber, selectedCountry.dialCode, selectedCountryCode]);
  const countryError = livePhoneErrors.country ?? errors.country;
  const phoneNumberError = livePhoneErrors.phoneNumber ?? errors.phoneNumber;
  const visibleCountryError = hasStartedPhoneValidation ? countryError : undefined;
  const visiblePhoneNumberError = hasStartedPhoneValidation ? phoneNumberError : undefined;

  function handleModeSwitch() {
    setMode(isEmailMode ? 'phone' : 'email');
    setErrors({});
    setHasStartedPhoneValidation(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    const passwordResult = passwordFieldSchema.safeParse(password);

    if (!passwordResult.success) {
      nextErrors.password = getFirstIssueMessage(passwordResult.error);
    }

    if (isEmailMode) {
      const emailResult = emailFieldSchema.safeParse(email);

      if (!emailResult.success) {
        nextErrors.email = getFirstIssueMessage(emailResult.error);
      }
    } else {
      setHasStartedPhoneValidation(true);

      if (countryError) {
        nextErrors.country = countryError;
      }

      if (phoneNumberError) {
        nextErrors.phoneNumber = phoneNumberError;
      }
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onLoginSuccess();
    }
  }

  return (
    <AuthLayout
      illustrationSrc={illustrationSrc}
      illustrationAlt={isEmailMode ? 'Email login illustration' : 'Phone login illustration'}
    >
      <div className="mb-[19px] text-left">
        <h1 className="m-0 text-left align-middle text-[32px] font-semibold leading-10 tracking-[0.25px] text-foreground">
          Welcome Back
        </h1>
        <p className="mt-3 text-left align-middle text-sm font-normal leading-5 tracking-[0.25px] text-foreground">
          Enter your Credentials to access your account
        </p>
      </div>

      <form className="grid gap-[17px]" noValidate onSubmit={handleSubmit}>
        {isEmailMode ? (
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4 max-[560px]:items-start">
              <Label htmlFor="email" className={fieldLabelClassName}>
                Email
              </Label>
              <button type="button" onClick={handleModeSwitch} className={switchButtonClassName}>
                Sign In with Phone Number
              </button>
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="username@gmail.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={inputClassName}
            />
            {errors.email ? (
              <p id="email-error" className={fieldErrorClassName}>
                {errors.email}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-4 max-[560px]:items-start">
              <Label htmlFor="phoneNumber" className={fieldLabelClassName}>
                Mobile Number
              </Label>
              <button type="button" onClick={handleModeSwitch} className={switchButtonClassName}>
                Sign In with Email
              </button>
            </div>

            <div
              className={cn(
                'flex h-10 w-full items-center overflow-hidden rounded border border-input bg-white',
                'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/15',
                visibleCountryError || visiblePhoneNumberError
                  ? '!border-destructive focus-within:!border-destructive focus-within:ring-destructive/15'
                  : undefined,
              )}
              data-invalid={Boolean(visibleCountryError || visiblePhoneNumberError) || undefined}
            >
              <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                <SelectTrigger
                  id="country"
                  className="h-10 min-h-10 w-auto min-w-[78px] rounded-none border-0 bg-transparent py-0 pl-[18px] pr-2.5 text-base text-foreground shadow-none focus-visible:ring-0 [&>svg]:hidden"
                  aria-label="Country code"
                >
                  <SelectValue>
                    <span className="inline-flex items-center gap-2.5">
                      <span aria-hidden="true">{selectedCountry.flag}</span>
                      <span>{selectedCountry.dialCode}</span>
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent
                  align="start"
                  side="bottom"
                  sideOffset={6}
                  position="popper"
                  className="min-w-[220px] rounded border-[color-mix(in_srgb,var(--app-primary)_20%,var(--app-border))] shadow-[0_12px_32px_color-mix(in_srgb,var(--app-text)_12%,transparent)] [&_[data-radix-select-viewport]]:w-full"
                >
                  {loginCountries.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="text-foreground focus:bg-primary/10 focus:text-primary data-[state=checked]:font-medium data-[state=checked]:text-primary data-[state=checked]:[&_svg]:text-primary"
                    >
                      <span className="inline-flex items-center gap-2">
                        <span aria-hidden="true">{country.flag}</span>
                        <span>{country.dialCode}</span>
                        <span>{country.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => {
                  setPhoneNumber(event.target.value);
                  setHasStartedPhoneValidation(true);
                }}
                placeholder="Enter your number"
                aria-invalid={Boolean(visibleCountryError || visiblePhoneNumberError)}
                aria-describedby={
                  visibleCountryError || visiblePhoneNumberError ? 'phone-error' : undefined
                }
                className="h-10 flex-1 rounded-none border-0 bg-transparent py-0 pl-0.5 pr-4 text-base text-foreground shadow-none placeholder:text-[var(--app-placeholder)] focus-visible:ring-0"
              />
            </div>
            {visibleCountryError || visiblePhoneNumberError ? (
              <p id="phone-error" className={fieldErrorClassName}>
                {visibleCountryError ?? visiblePhoneNumberError}
              </p>
            ) : null}
          </div>
        )}

        <div className="grid gap-[7px]">
          <Label htmlFor="password" className={fieldLabelClassName}>
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className={cn(inputClassName, 'pr-[54px]')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 h-8 min-h-8 w-8 -translate-y-1/2 border-0 bg-transparent text-foreground shadow-none hover:bg-transparent hover:text-foreground"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? (
                <Eye className="size-4" aria-hidden="true" />
              ) : (
                <EyeClosed className="size-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          {errors.password ? (
            <p id="password-error" className={fieldErrorClassName}>
              {errors.password}
            </p>
          ) : null}
          <button
            type="button"
            className={cn(switchButtonClassName, 'justify-self-start text-left')}
          >
            Forgot Password?
          </button>
        </div>

        <Button type="submit" className={signInButtonClassName}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
