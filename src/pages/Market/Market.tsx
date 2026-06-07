import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Search } from 'lucide-react';

import { useCryptoMarketsQuery } from '@/api/markets';
import { Skeleton } from '@/components/Skeleton';
import { cn } from '@/utils/cn';
import type { CryptoMarket } from './marketData';

type MarketTab = 'all' | 'cryptocurrency' | 'favorites';

const tabs: Array<{ label: string; value: MarketTab }> = [
  { label: 'All', value: 'all' },
  { label: 'Cryptocurrency', value: 'cryptocurrency' },
  { label: 'Favorites', value: 'favorites' },
];

function useDebouncedValue<T>(value: T, delay = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay, value]);

  return { debouncedValue, isDebouncing: value !== debouncedValue };
}

function formatMarketName(market: CryptoMarket) {
  if (market.name) {
    return market.name;
  }

  return market.id
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatUsdApproximation(priceIdr: string) {
  const numericValue = Number(priceIdr.replace(/[^\d,]/g, '').replace(',', '.'));

  if (!Number.isFinite(numericValue)) {
    return '0.00';
  }

  return (numericValue / 16_000).toLocaleString('id-ID', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function CoinLogo({ market, selected }: { market: CryptoMarket; selected?: boolean }) {
  if (market.image) {
    return (
      <img
        src={market.image}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        className={cn('h-10 w-10 rounded object-cover', selected && 'bg-white')}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid h-10 w-10 place-items-center rounded bg-[#2F6FED] text-sm font-bold text-white',
        selected && 'bg-[#FF9900]',
      )}
    >
      {market.symbol.slice(0, 1)}
    </div>
  );
}

function MarketRow({
  market,
  selected,
  onSelect,
}: {
  market: CryptoMarket;
  selected: boolean;
  onSelect: () => void;
}) {
  const name = formatMarketName(market);

  return (
    <button
      type="button"
      className={cn(
        'grid min-h-[66px] w-full grid-cols-[48px_1fr_auto] items-center gap-2 rounded px-3 py-2 text-left transition-colors',
        selected
          ? 'bg-primary text-primary-foreground'
          : 'bg-[#D2D2D2] text-foreground hover:bg-[#C8CBD3]',
      )}
      onClick={onSelect}
    >
      <CoinLogo market={market} selected={selected} />

      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1.5">
          <p className="m-0 truncate text-base font-bold leading-5">{market.symbol}</p>
          {market.hot ? <span aria-label="Hot market">🔥</span> : null}
        </div>
        <p className="m-0 truncate text-[13px] leading-[18px]">{name}</p>
      </div>

      <div className="grid min-w-[116px] justify-items-end gap-2">
        <span
          className={cn(
            'rounded bg-[#F4F6FB] px-1.5 py-1 text-[13px] font-medium leading-none',
            market.isPositive ? 'text-[#20B26B]' : 'text-[#E04141]',
          )}
        >
          {market.change_percent}
        </span>
        <span className="max-w-[116px] truncate text-[13px] font-bold leading-4">
          {market.price_idr}
        </span>
      </div>
    </button>
  );
}

function MarketListSkeleton() {
  return (
    <div className="grid gap-4" aria-label="Loading markets" aria-busy="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="grid min-h-[66px] grid-cols-[48px_1fr_auto] gap-2 rounded bg-[#D2D2D2] px-3 py-2">
          <Skeleton className="h-10 w-10 rounded bg-[#BBC0CA]" />
          <div className="grid content-center gap-2">
            <Skeleton className="h-4 w-20 bg-[#BBC0CA]" />
            <Skeleton className="h-3 w-28 bg-[#BBC0CA]" />
          </div>
          <div className="grid content-center justify-items-end gap-2">
            <Skeleton className="h-5 w-14 bg-[#BBC0CA]" />
            <Skeleton className="h-3 w-24 bg-[#BBC0CA]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Market() {
  const { data: markets = [], isError, isLoading } = useCryptoMarketsQuery();
  const [activeTab, setActiveTab] = useState<MarketTab>('all');
  const [search, setSearch] = useState('');
  const [preferredMarketId, setPreferredMarketId] = useState<string | null>(null);
  const { debouncedValue: debouncedSearch, isDebouncing } = useDebouncedValue(search);

  const filteredMarkets = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();

    return markets.filter((market) => {
      const name = formatMarketName(market);
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'favorites' ? market.isFavorite : market.type === activeTab);
      const matchesSearch =
        !normalizedSearch ||
        name.toLowerCase().includes(normalizedSearch) ||
        market.symbol.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, debouncedSearch, markets]);

  const selectedMarket =
    filteredMarkets.find((market) => market.id === preferredMarketId) ?? filteredMarkets[0];
  const showSkeleton = isLoading || isDebouncing;
  const emptySearchKeyword = debouncedSearch.trim();

  return (
    <main className="min-h-screen bg-[#FBFCFE] text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[362px_1fr]">
        <aside className="flex h-screen flex-col bg-[#F5F7FC] px-4 py-6 lg:sticky lg:top-0">
          <h1 className="mx-4 mb-4 mt-0 text-xl font-bold leading-6">Markets</h1>

          <label className="relative mx-3 block">
            <span className="sr-only">Search markets</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded border border-[#CBD3EA] bg-[#FBFCFE] px-3 pr-11 text-base outline-none placeholder:text-[#CFCFCF] focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Search className="pointer-events-none absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 text-foreground" />
          </label>

          <div className="mt-7 flex items-center gap-2 px-1">
            <div className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden border-b border-[#B9C0D5]">
              <div className="grid w-full min-w-0 grid-cols-[0.7fr_1.7fr_1.2fr] items-end">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    type="button"
                    className={cn(
                      'relative h-9 min-w-0 cursor-pointer px-1 text-center text-sm font-medium transition-colors after:absolute after:bottom-[-1px] after:left-0 after:h-0.5 after:w-full after:bg-transparent after:content-[""]',
                      activeTab === tab.value
                        ? 'text-primary after:bg-primary'
                        : 'text-foreground hover:text-primary',
                    )}
                    onClick={() => setActiveTab(tab.value)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-foreground"
              aria-label="More market filters"
            >
              <ChevronRight className="h-6 w-6" strokeWidth={2} />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
            {showSkeleton ? (
              <MarketListSkeleton />
            ) : isError ? (
              <div className="grid min-h-[116px] place-items-center rounded bg-white px-4 py-8 text-center text-sm text-foreground">
                <p className="m-0 max-w-[300px] font-medium leading-6">
                  Unable to load market data.
                  <br />
                  Please try again later.
                </p>
              </div>
            ) : filteredMarkets.length ? (
              <div className="grid gap-4">
                {filteredMarkets.map((market) => (
                  <MarketRow
                    key={market.id}
                    market={market}
                    selected={market.id === selectedMarket?.id}
                    onSelect={() => setPreferredMarketId(market.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid min-h-[116px] place-items-center rounded bg-white px-4 py-8 text-center text-sm text-foreground">
                {emptySearchKeyword ? (
                  <p className="m-0 max-w-[360px] font-medium leading-6">
                    We couldn't find '{emptySearchKeyword}.'
                    <br />
                    Try searching with a different keyword.
                  </p>
                ) : (
                  <p className="m-0 font-medium leading-6">No market matches this filter.</p>
                )}
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 bg-white">
          <header className="flex h-[126px] items-center gap-3 border-b border-[#D6DCEB] px-6 lg:px-14">
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt=""
              width={40}
              height={40}
              decoding="async"
              className="h-10 w-10 rounded object-cover"
            />
            <p className="m-0 text-[32px] font-bold leading-none max-sm:text-2xl">John Johnson</p>
          </header>

          <div className="px-6 py-5 lg:px-14">
            <h2 className="m-0 text-2xl font-bold leading-8">Welcome to Trading Dashboard</h2>

            {selectedMarket ? (
              <div className="mt-6 flex items-center gap-3">
                <CoinLogo market={selectedMarket} selected />
                <div className="flex min-w-0 items-center gap-4 max-sm:flex-col max-sm:items-start max-sm:gap-1">
                  <h3 className="m-0 text-2xl font-bold leading-7">
                    {selectedMarket.symbol}/USDT
                  </h3>
                  <div className="text-sm font-medium leading-4 text-[#20B26B]">
                    <p className="m-0">$ {formatUsdApproximation(selectedMarket.price_idr)}</p>
                    <p className="m-0">{selectedMarket.change_percent.replace(',', '.')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm text-muted-foreground">Select a market to view details.</div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
