import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Receipt,
  Fuel,
  FileText,
  Search
} from 'lucide-react';

export const DailyClosureHistory = () => {
  const { pastClosures, drivers } = useBakery();
  const [selectedDriverFilter, setSelectedDriverFilter] = useState('all');
  const [searchDate, setSearchDate] = useState('');

  const filteredClosures = pastClosures.filter((closure) => {
    const matchesDriver = selectedDriverFilter === 'all' || closure.driverId === selectedDriverFilter;
    const matchesDate = !searchDate || closure.date.includes(searchDate);
    return matchesDriver && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="glass-input text-xs rounded-xl px-3 py-2"
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate('')}
              className="text-xs text-amber-400 hover:underline px-2"
            >
              Limpiar fecha
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-500" />
          <select
            value={selectedDriverFilter}
            onChange={(e) => setSelectedDriverFilter(e.target.value)}
            className="glass-input text-xs rounded-xl px-3 py-2"
          >
            <option value="all">Todos los Repartidores</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Closures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClosures.length === 0 ? (
          <div className="col-span-2 glass-panel p-8 text-center text-slate-500 rounded-2xl text-xs">
            No se encontraron liquidaciones ni cierres para los filtros seleccionados.
          </div>
        ) : (
          filteredClosures.map((closure) => {
            const isClean = closure.status === 'cuadrado';
            return (
              <div
                key={closure.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  isClean
                    ? 'border-emerald-500/20 hover:border-emerald-500/40'
                    : 'border-rose-500/30 hover:border-rose-500/50 bg-rose-950/10'
                }`}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base font-heading">
                        {closure.driverName}
                      </span>
                      <Badge variant={isClean ? 'emerald' : 'rose'} size="sm">
                        {isClean ? 'Cuadrado' : 'Con Desvío'}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(closure.date)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Rendido a Fábrica
                    </span>
                    <div className="text-lg font-extrabold text-amber-400 font-mono">
                      {formatCurrency(closure.cashHandedIn)}
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2 py-3.5 text-center font-mono text-xs border-b border-slate-800/80">
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Total Venta</span>
                    <span className="font-bold text-white">{formatCurrency(closure.totalBilled)}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Cobrado Efec.</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(closure.cashCollected)}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-sans block">Gastos Nafta</span>
                    <span className="font-bold text-amber-400">{formatCurrency(closure.expensesAmount)}</span>
                  </div>
                </div>

                {/* Status and Notes */}
                <div className="pt-3 text-xs">
                  <p className="text-slate-300 leading-relaxed font-sans">{closure.summary}</p>

                  {closure.cashDifference !== 0 && (
                    <div className="mt-2 text-rose-400 font-mono font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Diferencia en Caja: {formatCurrency(closure.cashDifference)}</span>
                    </div>
                  )}
                  {closure.stockDifferencesCount > 0 && (
                    <div className="mt-1 text-rose-400 font-mono font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Faltante de Stock: {closure.stockDifferencesCount} unidades no declaradas</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
