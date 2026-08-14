/* eslint-disable linebreak-style */
/* eslint-disable quotes */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

type ButtonProps = Omit<React.ComponentProps<'button'>, 'size'> &
  Omit<React.ComponentProps<'select'>, 'size'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    selectButton?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  selectButton = false,
  children,
  ...props
}: ButtonProps) {
  if (selectButton) {
    return (
      <div className='relative inline-flex'>
        <select
          data-slot='select-button'
          className={cn(
            buttonVariants({ variant, size }),
            'appearance-none cursor-pointer pr-8',
            className,
          )}
          {...(props as React.ComponentProps<'select'>)}
        >
          {children}
        </select>

        <div className='pointer-events-none absolute inset-y-0 right-2 flex items-center'>
          <svg className='h-4 w-4 fill-current opacity-70' viewBox='0 0 20 20'>
            <path d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' />
          </svg>
        </div>
      </div>
    );
  }

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
