import { useQuery } from '@tanstack/react-query';

import { apiEndpoints } from '@/api/endpoints';
import { httpClient } from '@/api/httpClient';

import type { CountryListResponse } from '@/types/country';

export const countryQueryKeys = {
  all: ['countries'] as const,
  list: () => [...countryQueryKeys.all, 'list'] as const,
};

export async function fetchCountries() {
  const response = await httpClient.get<CountryListResponse>(apiEndpoints.countries.list);

  return response.data;
}

export function useCountriesQuery() {
  return useQuery({
    queryKey: countryQueryKeys.list(),
    queryFn: fetchCountries,
  });
}
