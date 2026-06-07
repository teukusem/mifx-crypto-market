import type { Country } from '@/types/country';

export function getFlagEmoji(countryCode: string) {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function selectDefaultCountry(countries: readonly Country[]): Country | null {
  if (countries.length === 0) {
    return null;
  }

  return countries.find((country) => country.code === 'ID') ?? countries[0];
}

export function getCountryByCode(countries: readonly Country[], code: string): Country | null {
  return countries.find((country) => country.code === code) ?? null;
}
