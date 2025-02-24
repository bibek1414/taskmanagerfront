import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';

const Select = ({ children, value, onValueChange }) => {
  return (
    <Listbox value={value} onChange={onValueChange}>
      {children}
    </Listbox>
  );
};

const SelectTrigger = ({ children, className }) => {
  return (
    <Listbox.Button className={classNames('relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm', className)}>
      {children}
    </Listbox.Button>
  );
};

const SelectValue = ({ children, placeholder }) => {
  return (
    <span className="block truncate">
      {children || placeholder}
    </span>
  );
};

const SelectContent = ({ children }) => {
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
        {children}
      </Listbox.Options>
    </Transition>
  );
};

const SelectItem = ({ children, value }) => {
  return (
    <Listbox.Option
      className={({ active }) =>
        classNames('cursor-default select-none relative py-2 pl-3 pr-9', {
          'text-white bg-blue-600': active,
          'text-gray-900': !active,
        })
      }
      value={value}
    >
      {({ selected }) => (
        <>
          <span className={classNames('block truncate', { 'font-semibold': selected })}>
            {children}
          </span>
        </>
      )}
    </Listbox.Option>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };