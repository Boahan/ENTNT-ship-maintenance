import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  children,
  disabled = false
}) => {
  const id = `form-field-${name}`;
  
  const baseInputClasses = 'block w-full rounded-md shadow-sm sm:text-sm';
  const normalInputClasses = 'border-gray-300 focus:ring-teal-500 focus:border-teal-500';
  const errorInputClasses = 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500';
  const inputClasses = `${baseInputClasses} ${error ? errorInputClasses : normalInputClasses}`;
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="mt-1">
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
            rows={3}
            disabled={disabled}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={inputClasses}
            disabled={disabled}
          >
            {children}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={inputClasses}
            disabled={disabled}
          />
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;