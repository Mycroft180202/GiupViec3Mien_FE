import React from 'react';
import cx from 'classnames';
import './Button.css';

const Button = ({
  children,
  variant = 'primary', // primary | secondary | outline | ghost
  size = 'md', // sm | md | lg
  type = 'button',
  fullWidth = false,
  className,
  icon,
  ...props
}) => {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'w-full': fullWidth },
        className
      )}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
