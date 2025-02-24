import React from 'react';
import { useFormContext, Controller, FormProvider } from 'react-hook-form';

const Form = ({ children, ...props }) => {
  return (
    <FormProvider {...props}>
      <form {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

const FormField = ({ name, render }) => {
  const { control } = useFormContext(); // Access the form context
  return (
    <Controller
      name={name}
      control={control}
      render={render}
    />
  );
};

const FormItem = ({ children }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

const FormLabel = ({ children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

const FormControl = ({ children }) => {
  return (
    <div className="mt-1">
      {children}
    </div>
  );
};

const FormMessage = ({ children }) => {
  return (
    <p className="mt-2 text-sm text-red-600">
      {children}
    </p>
  );
};

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage };