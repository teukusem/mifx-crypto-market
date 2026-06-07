import { z } from 'zod';

export const emailFieldSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .email('Enter a valid email address');

export function createPhoneLoginSchema(dialCode?: string) {
  return z.object({
    country: z.string().min(1, 'Country is required'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^\d+$/, 'Phone number must contain digits only')
      .superRefine((phoneNumber, context) => {
        if (!dialCode) {
          context.addIssue({
            code: 'custom',
            message: 'Country is required',
          });
          return;
        }

        const countryCode = dialCode.replace(/\D/g, '');

        if (phoneNumber.startsWith('0')) {
          context.addIssue({
            code: 'custom',
            message: 'Phone number cannot start with 0',
          });
        }

        if (phoneNumber.startsWith(countryCode)) {
          context.addIssue({
            code: 'custom',
            message: `Country code (${dialCode}) is already selected. Enter your mobile number only.`,
          });
        }

        const fullPhone = `${countryCode}${phoneNumber}`;

        if (fullPhone.length > 13) {
          context.addIssue({
            code: 'custom',
            message: 'Phone number must be at most 13 digits including country code',
          });
        }
      }),
  });
}

export function getPhoneLoginErrors(params: {
  country: string;
  phoneNumber: string;
  dialCode?: string;
}) {
  const result = createPhoneLoginSchema(params.dialCode).safeParse({
    country: params.country,
    phoneNumber: params.phoneNumber,
  });

  if (result.success) {
    return {};
  }

  const errors = result.error.flatten().fieldErrors;

  return {
    country: errors.country?.[0],
    phoneNumber: errors.phoneNumber?.[0],
  };
}

export function getFirstIssueMessage(error: z.ZodError) {
  return error.issues[0]?.message;
}

export const passwordFieldSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters');
