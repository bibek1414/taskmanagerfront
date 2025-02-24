import React from 'react';
import classNames from 'classnames';

const Card = ({ children, className }) => {
  return (
    <div className={classNames('bg-white shadow rounded-lg', className)}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={classNames('px-4 py-5 border-b border-gray-200 sm:px-6', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }) => {
  return (
    <h3 className={classNames('text-lg leading-6 font-medium text-gray-900', className)}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className }) => {
  return (
    <p className={classNames('mt-1 max-w-2xl text-sm text-gray-500', className)}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={classNames('px-4 py-5 sm:p-6', className)}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardDescription, CardContent };