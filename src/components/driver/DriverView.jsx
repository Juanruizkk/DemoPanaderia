import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { ClientRouteList } from './ClientRouteList';
import { BulkSpreadsheet } from './BulkSpreadsheet';
import { VanStockView } from './VanStockView';
import { ExpenseLogger } from './ExpenseLogger';
import { DailyClosure } from './DailyClosure';
import {
  MapPin,
  FileSpreadsheet,
  Package,
  Fuel,
  CheckSquare,
  RotateCcw,
  PlayCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DriverView = () => {
  const { activeDriver, activeDriverId, activeCashSettlement, resetDriverData, resetAllDataToInitial } = useBakery();
  const [confirmReset, setConfirmReset] = useState(null); // null | 'driver' | 'demo'
  const [activeDriverTab, setActiveDriverTab] = useState('route'); // 'route', 'bulk', 'stock', 'expenses', 'closure'

  const driverTabs = [
    { id: 'route', label: 'Hoja de Ruta (Móvil)', icon: MapPin },
    { id: 'bulk', label: 'Planilla Masiva (Excel)', icon: FileSpreadsheet },
    { id: 'stock', label: 'Stock Camioneta', icon: Package },
    { id: 'expenses', label: 'Gastos & Nafta', icon: Fuel },
    { id: 'closure', label: 'Cierre de Jornada', icon: CheckSquare },
  ];

  const handleConfirmAction = () => {
    if (confirmReset === 'driver') resetDriverData(activeDriverId);
    else if (confirmReset === 'demo') resetAllDataToInitial();
    setConfirmReset(null);
  };

  return (
    <div className="space-y-5">
      {/* Confirmation Dialog */}
      {confirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="text-3xl">{confirmReset === 'driver' ? '🗑️' : '🎬'}</div>
              <h3 className="text-base font-bold text-white">
                {confirmReset === 'driver' ? 'Limpiar jornada del repartidor' : 'Cargar datos de demo'}
              </h3>
              <p className="text-xs text-slate-400">
                {confirmReset === 'driver'
                  ? `Se eliminarán todos los pedidos, gastos y movimientos de camioneta de ${activeDriver.name}. Esta acción no se puede deshacer.`
                  : 'Se restaurarán todos los datos iniciales de demo (todos los repartidores). Se perderán los cambios actuales.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmReset(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Driver Header Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/80 text-white flex items-center justify-center text-xl shadow-sm">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-heading">{activeDriver.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {activeDriver.vehicle}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Registra entregas a clientes, cobranzas, combustible y stock disponible en camioneta.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Demo buttons */}
          <button
            onClick={() => setConfirmReset('driver')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200 transition-all"
            title="Limpiar jornada del repartidor"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetear Vista</span>
          </button>
          <button
            onClick={() => setConfirmReset('demo')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-all"
            title="Cargar datos de demo completos"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Simular Demo</span>
          </button>

          {/* Quick Cash In Hand Pill */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Efectivo Cobrado en Calle
            </span>
            <span className="text-lg font-extrabold text-emerald-400 font-mono">
              {formatCurrency(activeCashSettlement.totalCashCollected)}
            </span>
          </div>
        </div>
      </div>

      {/* Driver Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {driverTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDriverTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDriverTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Driver Subtab Content */}
      <div className="pt-2">
        {activeDriverTab === 'route' && <ClientRouteList />}
        {activeDriverTab === 'bulk' && <BulkSpreadsheet />}
        {activeDriverTab === 'stock' && <VanStockView />}
        {activeDriverTab === 'expenses' && <ExpenseLogger />}
        {activeDriverTab === 'closure' && <DailyClosure />}
      </div>
    </div>
  );
};
