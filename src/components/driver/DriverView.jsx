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
  Truck,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const DriverView = () => {
  const { activeDriver, activeCashSettlement } = useBakery();
  const [activeDriverTab, setActiveDriverTab] = useState('route'); // 'route', 'bulk', 'stock', 'expenses', 'closure'

  const driverTabs = [
    { id: 'route', label: 'Hoja de Ruta (Móvil)', icon: MapPin },
    { id: 'bulk', label: 'Planilla Masiva (Excel)', icon: FileSpreadsheet },
    { id: 'stock', label: 'Stock Camioneta', icon: Package },
    { id: 'expenses', label: 'Gastos & Nafta', icon: Fuel },
    { id: 'closure', label: 'Cierre de Jornada', icon: CheckSquare },
  ];

  return (
    <div className="space-y-5">
      {/* Driver Header Card */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-blue-500/20 bg-gradient-to-r from-blue-950/20 via-slate-900/60 to-slate-900/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 text-xl font-bold">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-heading">{activeDriver.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {activeDriver.vehicle}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Registra entregas a clientes, cobranzas, combustible y stock disponible en camioneta.
            </p>
          </div>
        </div>

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

      {/* Driver Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {driverTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeDriverTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDriverTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
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
