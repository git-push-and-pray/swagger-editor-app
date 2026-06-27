import type { JSX } from 'react/jsx-runtime';

import { uiConfig } from '@/config/buttonConfig';
import type { ButtonProps } from '@/types/ui';

import Icon from './Icon';

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
  size,
  className = '',
}: ButtonProps): JSX.Element => {
  const buttonClasses = [
    uiConfig.button.variants[btnVersion],
    uiConfig.button.sizes[size],
    uiConfig.common.layout,
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
