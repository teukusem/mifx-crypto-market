import type { ComponentProps } from 'react';

import { cn } from '@/utils/cn';

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-[var(--app-surface)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
