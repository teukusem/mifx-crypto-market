import { useQuery } from '@tanstack/react-query';

import { apiEndpoints } from '@/api/endpoints';
import { httpClient } from '@/api/httpClient';
import type { CryptoMarket } from '@/pages/Market/marketData';

type CryptoMarketListResponse = {
  success: boolean;
  message: string;
  data: CryptoMarket[];
};

export async function getCryptoMarkets() {
  const response = await httpClient.get<CryptoMarketListResponse>(apiEndpoints.markets.list);

  if (!response.data.success) {
    throw new Error(response.data.message || 'Unable to load crypto markets');
  }

  return response.data.data;
}

export function useCryptoMarketsQuery() {
  return useQuery({
    queryKey: ['markets', 'crypto'],
    queryFn: getCryptoMarkets,
    staleTime: 60_000,
  });
}
