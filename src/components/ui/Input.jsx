import React, { forwardRef, useId } from 'react';
import cx from 'classnames';
import './Input.css';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  className,
  fullWidth = true,
  icon,
  ...props
}, ref) => {
  const id = useId();

  return (
    <div className={cx('input-group', { 'w-full': fullWidth })}>
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          ref={ref}
          id={id}
          type={type}
          className={cx('input-field', { 'has-icon': icon, 'has-error': error }, className)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
