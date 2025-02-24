import React from 'react';
import classNames from 'classnames';

const Button = ({ children, variant = 'solid', size = 'md', className, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantStyles = {
    solid: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50',
    ghost: 'bg-transparent text-blue-600 hover:bg-blue-50',
  };
  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={classNames(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };