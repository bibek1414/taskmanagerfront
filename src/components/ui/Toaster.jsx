import React from 'react';
import { useToast } from './use-toast';

const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-lg transform transition-all duration-300 ease-in-out ${
            toast.variant === 'destructive' 
              ? 'bg-red-600 text-white' 
              : 'bg-green-600 text-white'
          }`}
        >
          <div className="font-bold">{toast.title}</div>
          <div>{toast.description}</div>
        </div>
      ))}
    </div>
  );
};

export { Toaster };
