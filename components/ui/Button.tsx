import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  ...props
}) => {
  const baseStyles =
    'w-[170px] h-[45px]  rounded border-2 bg-primary hover:bg-blue-700 transition-all duration-300 ease-in-out text-white font-semibold dark:border-none';

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-primary dark:shadow-2xl',
    secondary: 'bg-gray-500 hover:bg-gray-700',
    danger: 'bg-red-500 hover:bg-red-700',
    success: 'bg-green-500 hover:bg-green-700',
  };

  const buttonClass = `${baseStyles} ${variantStyles[variant] || variantStyles.primary}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
