import React from 'react';

export const Badge = ({ children, variant = 'neutral', size = 'md', className = '' }) => {
  const variantStyles = {
    neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
    amber: 'bg-slate-800/90 text-slate-200 border-slate-700/80',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    sky: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
    indigo: 'bg-slate-800/80 text-slate-300 border-slate-700/70',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-medium px-2.5 py-0.5',
    lg: 'text-xs font-semibold px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant] || variantStyles.neutral} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};
