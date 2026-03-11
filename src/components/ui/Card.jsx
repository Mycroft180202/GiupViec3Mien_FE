import React from 'react';
import cx from 'classnames';
import './Card.css';

const Card = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div className={cx('card', { 'card-hover': hoverable }, className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cx('card-header', className)}>{children}</div>
);

export const CardBody = ({ children, className }) => (
  <div className={cx('card-body', className)}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={cx('card-footer', className)}>{children}</div>
);

export default Card;
