import React, { useState } from 'react';
import { AuditTimeline } from './AuditTimeline';
import { DailyClosureHistory } from './DailyClosureHistory';
import { AuditStats } from './AuditStats';
import { History, Calendar, BarChart3 } from 'lucide-react';

export const AuditDashboard = () => {
  const [activeSubTab, setActiveSubTab] = useState('timeline'); // 'timeline', 'history', 'stats'

  const subTabs = [
    { id: 'timeline', label: 'Bitácora en Tiempo Real (Audit Trail)', icon: History },
    { id: 'history', label: 'Historial de Cierres Diarios', icon: Calendar },
    { id: 'stats', label: 'Estadísticas de Control & Desvíos', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
          Módulo de Auditoría & Trazabilidad Global
        </h1>
        <p className="text-xs text-slate-400">
          Registro inmutable de movimientos, cierres de caja históricos y prevención de fraude.
        </p>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-750'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab content */}
      <div className="pt-2">
        {activeSubTab === 'timeline' && <AuditTimeline />}
        {activeSubTab === 'history' && <DailyClosureHistory />}
        {activeSubTab === 'stats' && <AuditStats />}
      </div>
    </div>
  );
};
