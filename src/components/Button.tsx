import type { JSX } from 'react/jsx-runtime';

import type { ButtonSize, ButtonVersion } from '@/constants/ui-variants';
import { btnSizes, btnVariants } from '@/constants/ui-variants';

import type { IconSize, IconVersion } from './Icon';
import Icon from './Icon';

interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  name: string;
  icon?: IconVersion;
  iconSize?: IconSize;
  iconPosition?: 'left' | 'right';
  hideTextOnMobile?: boolean;
  disabled?: boolean;
  btnVersion: ButtonVersion;
  btnSize: ButtonSize;
  className?: string;
}

const Button = ({
  onClick,
  type = 'button',
  name,
  icon,
  iconSize = 'xs',
  iconPosition = 'left',
  hideTextOnMobile = true,
  disabled = false,
  btnVersion,
  btnSize,
  className = '',
}: ButtonProps): JSX.Element => {
  const buttonClasses = [
    btnVariants[btnVersion],
    btnSizes[btnSize],
    'inline-flex items-center justify-center gap-2',
    iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row',
    'cursor-pointer disabled:cursor-not-allowed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const textClasses = icon && hideTextOnMobile ? 'sr-only sm:not-sr-only sm:inline' : '';
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={buttonClasses}>
      {icon && <Icon name={icon} size={iconSize} />}
      <span className={textClasses}>{name}</span>
    </button>
  );
};

export default Button;
