import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import {
  Crown,
  Truck,
  Factory,
  History,
  RotateCcw,
  Sparkles,
  Calendar,
  AlertTriangle,
  ChevronDown,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Header = () => {
  const {
    currentRole,
    setCurrentRole,
    activeDriverId,
    setActiveDriverId,
    drivers,
    activeDriver,
    companySummary,
    resetAllDataToInitial,
    selectedDate,
  } = useBakery();

  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleRoleChange = (role, driverId = null) => {
    setCurrentRole(role);
    if (driverId) {
      setActiveDriverId(driverId);
    }
    setShowDriverDropdown(false);
  };

  const handleReset = () => {
    resetAllDataToInitial();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      {/* Top Notification Bar for Demo mode */}
      <div className="bg-gradient-to-r from-amber-600/20 via-amber-500/10 to-transparent border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
          <span>Demo Panadería DiPietro | Sistema Activo de Reparto & Control Antirrobo</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Jornada: 11/09/2026</span>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors px-2 py-0.5 rounded bg-slate-900 border border-slate-700/60"
            title="Restablecer datos a estado inicial de las planillas"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden md:inline">Reiniciar Demo</span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl shadow-lg shadow-amber-500/20 border border-amber-400/40">
            🥖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-heading">
                PANADERÍA DIPIETRO
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Despachos, Reparto en Calle y Auditoría de Stock
            </p>
          </div>
        </div>

        {/* Global Live Summary Pill */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2 text-xs">
          <div>
            <div className="text-slate-400">Venta Global Hoy</div>
            <div className="font-bold text-white text-sm">
              {formatCurrency(companySummary.totalBilled)}
            </div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div>
            <div className="text-slate-400">Efectivo a Rendir</div>
            <div className="font-bold text-emerald-400 text-sm">
              {formatCurrency(companySummary.netCashTotal)}
            </div>
          </div>
          {companySummary.totalStockMissingUnits > 0 && (
            <>
              <div className="h-6 w-px bg-slate-800" />
              <div className="flex items-center gap-1.5 text-rose-400">
                <AlertTriangle className="w-4 h-4 animate-bounce" />
                <div>
                  <div className="font-bold">{companySummary.totalStockMissingUnits} un. Faltantes</div>
                  <div className="text-[10px] text-rose-500 font-semibold">{formatCurrency(companySummary.totalStockLossValue)}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          {/* Admin Role */}
          <button
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'admin'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Superadmin</span>
          </button>

          {/* Drivers Menu with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentRole !== 'driver') {
                  handleRoleChange('driver', activeDriverId);
                } else {
                  setShowDriverDropdown(!showDriverDropdown);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'driver'
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{activeDriver ? activeDriver.name.split(' ')[0] : 'Repartidor'}</span>
              <ChevronDown
                className="w-3 h-3 text-current cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDriverDropdown(!showDriverDropdown);
                }}
              />
            </button>

            {showDriverDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Seleccionar Repartidor
                </div>
                {drivers.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleRoleChange('driver', d.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      activeDriverId === d.id && currentRole === 'driver'
                        ? 'text-blue-400 font-bold bg-blue-950/40'
                        : 'text-slate-300'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="text-[10px] text-slate-500">{d.vehicle.split('-')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Factory / Cadete Role */}
          <button
            onClick={() => handleRoleChange('factory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'factory'
                ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Factory className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Carga Fábrica</span>
            <span className="sm:hidden">Fábrica</span>
          </button>

          {/* History & Audit Role */}
          <button
            onClick={() => handleRoleChange('audit')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentRole === 'audit'
                ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Auditoría</span>
            <span className="sm:hidden">Auditoría</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Demo Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-amber-500/30">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white font-heading">¿Restablecer datos de demostración?</h3>
            </div>
            <p className="text-sm text-slate-300 mb-6">
              Esta acción restaurará todos los pedidos, saldos de clientes, cargas de camionetas y gastos al estado original de las fotos de DiPietro.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              >
                Sí, restablecer ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
