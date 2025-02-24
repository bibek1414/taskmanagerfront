import React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import classNames from 'classnames';

const DropdownMenu = ({ children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
};

const DropdownMenuTrigger = ({ children }) => {
  return (
    <Menu.Button as={Fragment}>
      {children}
    </Menu.Button>
  );
};

const DropdownMenuContent = ({ children, align = 'right' }) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className={classNames('origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none', {
        'right-0': align === 'right',
        'left-0': align === 'left',
      })}>
        {children}
      </Menu.Items>
    </Transition>
  );
};

const DropdownMenuItem = ({ children, onClick, className }) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={classNames('group flex items-center w-full px-2 py-2 text-sm', {
            'bg-gray-100': active,
          }, className)}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };