import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  variant = 'default', // default, emerald, rose, amber, sky
  className = '',
  onClick,
}) => {
  const glowMap = {
    default: 'border-slate-800/80 hover:border-slate-700 bg-slate-900/60',
    amber: 'border-slate-800/80 hover:border-slate-700 bg-slate-900/60',
    emerald: 'border-slate-800/80 hover:border-emerald-500/30 bg-slate-900/60',
    rose: 'border-rose-500/20 hover:border-rose-500/40 bg-rose-950/10',
    sky: 'border-slate-800/80 hover:border-slate-700 bg-slate-900/60',
  };

  const iconBgMap = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    amber: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    emerald: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-300 border border-rose-500/20',
    sky: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 border transition-all duration-200 ${glowMap[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-heading">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${iconBgMap[variant]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-400">
          {trend && (
            <span
              className={`inline-flex items-center font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
