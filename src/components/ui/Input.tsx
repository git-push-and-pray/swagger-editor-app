import { forwardRef } from 'react';
import type { JSX } from 'react/jsx-runtime';

interface InputProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'className'> {
  id: string;
  label: string;
  showLabel?: boolean;
  isRequired?: boolean;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      showLabel = true,
      id,
      type = 'text',
      isRequired = true,
      disabled = false,
      error,
      ...props
    },
    ref
  ): JSX.Element => {
    const isPassword = type === 'password';
    const errorId = `${id}-error`;
    return (
      <div className="flex flex-col gap-1.5">
        {showLabel && (
          <label htmlFor={id} className="font-sans text-sm font-medium">
            <span>{label}</span>
            {isRequired && <span className="text-errordark ml-1 text-base">*</span>}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          id={id}
          name={id}
          type={type}
          maxLength={50}
          aria-required={isRequired}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          autoComplete={isPassword ? 'current-password' : 'off'}
          className={`w-full rounded-md border-2 px-3 py-2.5 font-sans text-sm transition-all outline-none ${error ? 'border-error' : 'border-border focus:border-accent'} disabled:bg-secondary/50 disabled:opacity-60`}
          {...props}
        />
        <p
          id={errorId}
          className={`text-errordark min-h-4 text-xs font-medium transition-all duration-300 ${error ? 'visible opacity-100' : 'invisible opacity-0'}`}
          role="alert"
        >
          {error || ' '}
        </p>
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
