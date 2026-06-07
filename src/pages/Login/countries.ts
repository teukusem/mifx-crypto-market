export type LoginCountry = {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
};

export const loginCountries: LoginCountry[] = [
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
];

export const defaultLoginCountry =
  loginCountries.find((country) => country.code === 'US') ?? loginCountries[0];

export function getLoginCountryByCode(code: string) {
  return loginCountries.find((country) => country.code === code) ?? defaultLoginCountry;
}
