'use client';

import type * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import Icon from './Icon';

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  className = '',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group data-slot="select-group" className={`p-2 ${className}`} {...props} />
  );
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className = '',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={`border-border focus-visible:outline-info bg-bg flex w-fit items-center justify-between gap-2 rounded-lg border py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-md transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <Icon size="s" name="chevron-down" className="text-text-secondary pointer-events-none" />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className = '',
  children,
  position = 'popper',
  align = 'end',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        data-align-trigger={position === 'item-aligned'}
        className={`bg-surface border-border text-text-primary relative z-50 max-h-(--radix-select-content-available-height) min-w-20 overflow-x-hidden overflow-y-auto rounded-lg border shadow-lg duration-300 ${className || ''}`}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="scroll-smooth p-1">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className = '',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={`text-text-secondary/80 bg-foreground/1 rounded-lg px-2 py-2 text-xs ${className}`}
      {...props}
    />
  );
}

function SelectItem({
  className = '',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={`focus:bg-secondary flex w-full cursor-default flex-row-reverse items-center justify-between gap-3 rounded-md px-2 py-1 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 ${className}`}
      {...props}
    >
      <span className="pointer-events-none flex items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon size="s" name="check" className="text-accentdark pointer-events-none" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className = '',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={`bg-border pointer-events-none -mx-1 my-1 h-px ${className}`}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className = '',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={`bg-surface z-10 flex cursor-default items-center justify-center py-0.5 ${className}`}
      {...props}
    >
      <Icon
        size="s"
        name="chevron-down"
        className="text-text-primary pointer-events-none rotate-180"
      />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className = '',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={`bg-surface z-10 flex cursor-default items-center justify-center py-0.5 ${className}`}
      {...props}
    >
      <Icon size="s" name="chevron-down" className="text-text-primary pointer-events-none" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
