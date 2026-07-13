export const toastConfig = {
  toastOptions: {
    classNames: {
      toast:
        'bg-surface border-border flex w-full sm:w-80 items-center gap-3 rounded-lg border border-solid p-4 shadow-lg overflow-hidden',
      title: 'text-text-primary font-sans text-sm font-medium',
      description: 'text-text-secondary font-sans text-xs font-normal',
      icon: 'flex-shrink-0',
      success: 'border-l-[6px] border-l-success [&_[data-icon]]:text-success',
      error: 'border-l-[6px] border-l-errordark [&_[data-icon]]:text-errordark',
      info: 'border-l-[6px] border-l-info [&_[data-icon]]:text-info',
      content: 'flex flex-col gap-1',
    },
  },
};
