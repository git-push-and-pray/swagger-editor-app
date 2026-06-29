const baseButton =
  'font-sans inline-flex px-3 py-1.5 items-center border-transparent border justify-center rounded-md font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info';
const baseLink =
  'font-sans text-center font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info';

export const uiConfig = {
  button: {
    variants: {
      primary: `bg-foreground text-text-foreground shadow-btn hover:not-disabled:opacity-80 disabled:bg-secondary disabled:text-text-secondary disabled:border-border/50 disabled:border disabled:border-solid ${baseButton}`,
      secondary: `bg-bg border border-border border-solid text-text-primary shadow-btn hover:not-disabled:bg-secondary disabled:opacity-40 ${baseButton}`,
      destructive: `bg-error text-text-foreground shadow-btn hover:not-disabled:opacity-80 disabled:opacity-40 ${baseButton}`,
      ghostRegular: `bg-transparent text-text-secondary disabled:opacity-40 hover:not-disabled:bg-error/10 hover:not-disabled:text-errordark hover:not-disabled:border-error hover:not-disabled:border-solid hover:not-disabled:border ${baseButton}`,
      ghostRed: `bg-transparent text-errordark disabled:opacity-40 hover:not-disabled:bg-error/10 hover:not-disabled:border-error hover:not-disabled:border-solid hover:not-disabled:border ${baseButton}`,
    },
    sizes: {
      sm: 'text-sm',
      xs: 'text-xs',
    },
  },
  link: {
    variants: {
      primary: `bg-foreground text-text-foreground shadow-btn hover:opacity-80 ${baseButton}`,
      regular: `text-text-primary hover:text-accent ${baseLink}`,
      secondary: `text-text-secondary hover:text-text-primary ${baseLink}`,
      nav: `bg-transparent text-text-secondary hover:bg-secondary hover:text-text-primary ${baseButton}`,
      activeNav: `bg-accent/30 text-text-primary shadow-btn hover:bg-secondary hover:text-text-primary ${baseButton}`,
    },
  },
  common: {
    layout: 'inline-flex items-center justify-center gap-2',
  },
};

export type ButtonVersion = keyof typeof uiConfig.button.variants;
export type LinkVersion = keyof typeof uiConfig.link.variants;
export type ButtonSize = keyof typeof uiConfig.button.sizes;
