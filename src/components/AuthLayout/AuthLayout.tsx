import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type AuthLayoutProps = {
  illustrationSrc: string;
  illustrationAlt: string;
  children: ReactNode;
  contentClassName?: string;
  progressClassName?: string;
};

export function AuthLayout({
  illustrationSrc,
  illustrationAlt,
  children,
  contentClassName,
  progressClassName,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-foreground">
      <section className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <aside className="relative order-2 hidden min-h-[360px] items-center justify-center overflow-hidden bg-secondary md:order-1 md:flex md:min-h-screen">
          <div className="constellation-bg" aria-hidden="true" />
          <img
            src={illustrationSrc}
            alt={illustrationAlt}
            loading="lazy"
            decoding="async"
            className="relative z-[1] mt-8 h-auto w-[min(560px,74%)] object-contain"
          />
        </aside>

        <section className="order-1 flex min-h-screen items-center justify-center bg-white px-6 py-14 md:order-2 md:min-h-screen md:px-[7.9vw] md:py-12 md:pr-[10.9vw]">
          <div className={cn('mt-0 w-[min(100%,548px)] md:mt-1', contentClassName)}>
            {children}
          </div>
        </section>
      </section>
      <div
        className={cn(
          'fixed bottom-0 left-0 h-[13px] w-20 bg-primary transition-[width] duration-200 ease-in-out md:left-1/2',
          progressClassName,
        )}
        aria-hidden="true"
      />
    </main>
  );
}
