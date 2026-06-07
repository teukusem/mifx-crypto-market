export function getDialCodeDigits(dialCode: string) {
  return dialCode.replace(/\D/g, '');
}

export function buildApiPhoneNumber(dialCode: string, localPhoneNumber: string): string {
  return `${getDialCodeDigits(dialCode)}${localPhoneNumber}`;
}
