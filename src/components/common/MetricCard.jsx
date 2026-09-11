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
    default: 'hover:border-slate-600',
    amber: 'hover:border-amber-500/50 glow-amber border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-900/40',
    emerald: 'hover:border-emerald-500/50 glow-emerald border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-slate-900/40',
    rose: 'hover:border-rose-500/50 glow-rose border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-slate-900/40',
    sky: 'hover:border-sky-500/50 border-sky-500/20 bg-gradient-to-br from-sky-950/20 to-slate-900/40',
  };

  const iconBgMap = {
    default: 'bg-slate-800 text-slate-300',
    amber: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    rose: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    sky: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
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
