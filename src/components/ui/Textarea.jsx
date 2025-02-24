import React from 'react';
import classNames from 'classnames';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={classNames('shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md', className)}
      {...props}
    />
  );
});

export { Textarea };