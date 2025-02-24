import React from 'react';
import classNames from 'classnames';

const Label = ({ children, htmlFor, className }) => {
  return (
    <label htmlFor={htmlFor} className={classNames('block text-sm font-medium text-gray-700', className)}>
      {children}
    </label>
  );
};

export { Label };