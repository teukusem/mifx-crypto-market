/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { buttonVariants } from './button.styles';

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants>) {
  return (
    <button
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
