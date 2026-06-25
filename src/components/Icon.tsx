import type { JSX } from 'react/jsx-runtime';

type IconVersion =
  | 'sun'
  | 'moon'
  | 'language'
  | 'sign-out'
  | 'sign-in'
  | 'sign-up'
  | 'award'
  | 'code'
  | 'team'
  | 'github'
  | 'external-link'
  | 'check'
  | 'check-circle'
  | 'alert'
  | 'save'
  | 'chevron-down'
  | 'play'
  | 'copy'
  | 'trash'
  | 'error-details'
  | 'arrow-right'
  | 'arrow-left'
  | 'status-code'
  | 'duration'
  | 'upload'
  | 'download'
  | 'request'
  | 'response';

type IconSize = 'l' | 'm' | 's';

interface IconProps {
  name: IconVersion;
  size?: IconSize;
  className?: string;
}

const IconSizeMap: Record<IconSize, number> = {
  l: 24,
  m: 20,
  s: 16,
};

const Icon = ({ name, size = 'm', className = '' }: IconProps): JSX.Element => {
  const dimension = IconSizeMap[size];

  return (
    <svg width={dimension} height={dimension} aria-hidden="true" className={`${className}`}>
      <use href={`/sprite.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;
