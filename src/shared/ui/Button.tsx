import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  const variantClass = variant === 'ghost' ? ' chat-btn-ghost' : '';
  const extra = className ? ` ${className}` : '';
  return <button className={`chat-btn${variantClass}${extra}`} {...rest} />;
}
