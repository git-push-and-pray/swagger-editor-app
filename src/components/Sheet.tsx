'use client';

import * as React from 'react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import Icon from './Icon';

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" className="cursor-pointer" {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={`data-[state=open]:animate-sheet-fade-in data-[state=closed]:animate-sheet-fade-out fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs ${className}`}
      {...props}
    />
  );
}

function SheetContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  showCloseButton?: boolean;
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-side="right"
        className={`bg-surface data-[state=open]:animate-sheet-slide-in data-[state=closed]:animate-sheet-slide-out data-[side=right]:border-border fixed z-50 flex flex-col items-center gap-4 shadow-lg transition ease-in-out data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-56 data-[side=right]:border-l-2 ${className}`}
        {...props}
      >
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" asChild className="self-end pt-4 pr-4">
            <button
              type="button"
              className="text-text-secondary hover:text-text-primary cursor-pointer text-center transition duration-300"
              aria-label="Close"
            >
              <Icon name="close" size="l" />
            </button>
          </SheetPrimitive.Close>
        )}
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}

export { Sheet, SheetClose, SheetContent, SheetTrigger };
