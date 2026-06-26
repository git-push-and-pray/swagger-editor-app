export const buttonBase =
  'font-sans inline-flex items-center border-transparent border justify-center rounded-md font-medium transition px-3 py-1.5 duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info';

export const linkBase =
  'font-sans text-center font-medium transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info';

export const btnVariants = {
  primary: `bg-foreground text-text-foreground shadow-btn hover:not-disabled:opacity-80 disabled:bg-secondary disabled:text-text-secondary disabled:border-border/50 disabled:border disabled:border-solid ${buttonBase}`,
  secondary: `bg-bg border border-border border-solid text-text-primary shadow-btn hover:not-disabled:bg-secondary disabled:opacity-40 ${buttonBase}`,
  destructive: `bg-error text-text-foreground shadow-btn hover:not-disabled:opacity-80 disabled:opacity-40 ${buttonBase}`,
  ghostRegular: `bg-transparent text-text-secondary disabled:opacity-40 hover:not-disabled:bg-error/10 hover:not-disabled:text-errordark hover:not-disabled:border-error hover:not-disabled:border-solid hover:not-disabled:border ${buttonBase}`,
  ghostRed: `bg-transparent text-errordark disabled:opacity-40 hover:not-disabled:bg-error/10 hover:not-disabled:border-error hover:not-disabled:border-solid hover:not-disabled:border ${buttonBase}`,
};

export const linkVariants = {
  primary: `bg-foreground text-text-foreground shadow-btn hover:opacity-80 ${buttonBase}`,
  regular: `text-text-primary hover:text-accent ${linkBase}`,
  secondary: `text-text-secondary hover:text-text-primary ${linkBase}`,
  nav: `bg-transparent text-text-secondary hover:bg-secondary hover:text-text-primary ${buttonBase}`,
  activeNav: `bg-accent/30 text-text-primary shadow-btn hover:bg-secondary hover:text-text-primary ${buttonBase}`,
};

export const btnSizes = {
  sm: 'text-sm',
  xs: 'text-xs',
};

export type ButtonVersion = keyof typeof btnVariants;
export type LinkVersion = keyof typeof linkVariants;
export type ButtonSize = keyof typeof btnSizes;
