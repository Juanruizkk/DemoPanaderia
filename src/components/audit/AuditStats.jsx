import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  ShieldCheck,
  ShieldAlert,
  Award,
  AlertOctagon,
  PieChart,
  DollarSign,
  Truck,
  TrendingDown
} from 'lucide-react';

export const AuditStats = () => {
  const { pastClosures, auditLogs, companySummary, drivers } = useBakery();

  const totalClosures = pastClosures.length;
  const cleanClosures = pastClosures.filter((c) => c.status === 'cuadrado').length;
  const healthScore = totalClosures > 0 ? Math.round((cleanClosures / totalClosures) * 100) : 100;

  const totalHistoricalLoss = pastClosures.reduce(
    (acc, c) => acc + (c.cashDifference < 0 ? Math.abs(c.cashDifference) : 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Health Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white font-heading">
                Índice de Salud de Auditoría & Control
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700">
                {healthScore}% Confiabilidad
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Calculado en base a {totalClosures} cierres de jornada auditados. Refleja el cumplimiento de rendición exacta de caja y stock en camioneta.
            </p>
          </div>
        </div>

        <div className="text-center md:text-right shrink-0">
          <span className="text-xs font-semibold text-slate-400 uppercase">Jornadas 100% Cuadradas</span>
          <div className="text-3xl font-bold text-white font-heading">
            {cleanClosures} de {totalClosures}
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Eventos Registrados</span>
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading font-mono">
            {auditLogs.length} acciones
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Bitácora inmutable con trazabilidad total
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase">Fugas Detectadas en Historial</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-3xl font-bold text-rose-300 font-heading font-mono">
            {formatCurrency(totalHistoricalLoss)}
          </div>
          <div className="text-xs text-rose-400/70 mt-1">
            Diferencias de caja históricas prevenidas
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Desvío de Mercadería Actual</span>
            <AlertOctagon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading font-mono">
            {companySummary.totalStockMissingUnits} un.
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Faltantes pendientes de justificar hoy
          </div>
        </div>
      </div>
    </div>
  );
};
