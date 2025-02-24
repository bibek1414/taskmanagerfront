import React from 'react';
import classNames from 'classnames';

const Badge = ({ children, variant = 'solid', className }) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantStyles = {
    solid: 'bg-gray-100 text-gray-800',
    outline: 'border border-gray-300 text-gray-800',
  };

  return (
    <span className={classNames(baseStyles, variantStyles[variant], className)}>
      {children}
    </span>
  );
};

export { Badge };