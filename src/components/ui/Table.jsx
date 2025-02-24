import React from 'react';
import classNames from 'classnames';

const Table = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={classNames('min-w-full divide-y divide-gray-200', className)}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className }) => {
  return (
    <thead className={classNames('bg-gray-50', className)}>
      {children}
    </thead>
  );
};

const TableRow = ({ children, className }) => {
  return (
    <tr className={classNames('bg-white', className)}>
      {children}
    </tr>
  );
};

const TableHead = ({ children, className }) => {
  return (
    <th
      scope="col"
      className={classNames('px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider', className)}
    >
      {children}
    </th>
  );
};

const TableBody = ({ children, className }) => {
  return (
    <tbody className={classNames('bg-white divide-y divide-gray-200', className)}>
      {children}
    </tbody>
  );
};

const TableCell = ({ children, className }) => {
  return (
    <td className={classNames('px-6 py-4 whitespace-nowrap', className)}>
      {children}
    </td>
  );
};

export { Table, TableHeader, TableRow, TableHead, TableBody, TableCell };