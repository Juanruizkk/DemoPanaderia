import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { calculateCashSettlementForDriver, calculateVanAuditForDriver } from '../../utils/calculations';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';
import {
  DollarSign,
  CreditCard,
  Receipt,
  Fuel,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CashReconciliation = () => {
  const { drivers, orders, expenses, closeDailyShift, products, vanMovements } = useBakery();
  const [selectedDriverId, setSelectedDriverId] = useState('rep-1');
  const [cashHandedIn, setCashHandedIn] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [closureSuccess, setClosureSuccess] = useState(false);

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const settlement = calculateCashSettlementForDriver(selectedDriverId, orders, expenses);
  const vanAudit = calculateVanAuditForDriver(selectedDriverId, products, vanMovements, orders);

  const enteredCash = cashHandedIn === '' ? settlement.netCashDueToBakery : Number(cashHandedIn);
  const cashDiff = enteredCash - settlement.netCashDueToBakery;
  const isBalanced = cashDiff === 0 && vanAudit.totalFaltantesUnidades === 0;

  const handleApproveClosure = () => {
    closeDailyShift(selectedDriverId, enteredCash, closureNotes);
    setClosureSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setClosureSuccess(false);
      setCashHandedIn('');
      setClosureNotes('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Driver Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {drivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => {
                setSelectedDriverId(driver.id);
                setCashHandedIn('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedDriverId === driver.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{driver.name}</span>
            </button>
          ))}
        </div>

        <Badge variant={isBalanced ? 'emerald' : 'rose'} size="lg">
          {isBalanced ? 'Caja Lista para Liquidar' : 'Diferencia Detectada'}
        </Badge>
      </div>

      {/* Financial Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturado */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Ventas Ruta</span>
            <Receipt className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-heading">
            {formatCurrency(settlement.totalBilled)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {settlement.ordersCount} pedidos entregados hoy
          </div>
        </div>

        {/* Cobrado Efectivo */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase">Cobrado en Efectivo</span>
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-heading">
            {formatCurrency(settlement.totalCashCollected)}
          </div>
          <div className="text-xs text-emerald-400/70 mt-1">
            Plata física recaudada en mano
          </div>
        </div>

        {/* Cobrado Transferencia */}
        <div className="glass-card rounded-2xl p-5 border border-blue-500/20 bg-blue-950/10">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase">Cobrado Transferencias</span>
            <CreditCard className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-blue-300 font-heading">
            {formatCurrency(settlement.totalTransferCollected)}
          </div>
          <div className="text-xs text-blue-400/70 mt-1">
            Acreditado directo en banco
          </div>
        </div>

        {/* Gastos y Combustible */}
        <div className="glass-card rounded-2xl p-5 border border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase">Gastos de Ruta</span>
            <Fuel className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-300 font-heading">
            {formatCurrency(settlement.totalExpenses)}
          </div>
          <div className="text-xs text-amber-400/70 mt-1">
            Combustible y viáticos autorizados
          </div>
        </div>
      </div>

      {/* Detailed Reconciliation Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Cash Settlement Flow */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <span>Liquidación de Dinero en Fábrica</span>
            <span className="text-xs font-normal text-slate-400">({selectedDriver.name})</span>
          </h3>

          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-sans">Total Efectivo Cobrado en Calle:</span>
              <span className="text-emerald-400 font-bold">+{formatCurrency(settlement.totalCashCollected)}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-300 font-sans">Menos Gastos Pagados en Efectivo (Nafta, etc.):</span>
              <span className="text-amber-400 font-bold">-{formatCurrency(settlement.cashExpenses)}</span>
            </div>

            <div className="h-px bg-slate-700 my-2" />

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border-2 border-amber-500/40 glow-amber">
              <div>
                <span className="text-sm font-bold text-white block font-sans">
                  EFECTIVO TEÓRICO A ENTREGAR EN CAJA FÁBRICA:
                </span>
                <span className="text-xs text-slate-400 font-sans font-normal">
                  Monto que el repartidor debe poner sobre el mostrador
                </span>
              </div>
              <span className="text-2xl font-extrabold text-amber-300 font-mono">
                {formatCurrency(settlement.netCashDueToBakery)}
              </span>
            </div>
          </div>

          {/* List of Registered Expenses for this driver */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Comprobantes de Gastos Declarados
            </h4>
            {settlement.expensesList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No hay gastos declarados por este repartidor hoy.</p>
            ) : (
              <div className="space-y-2">
                {settlement.expensesList.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                        <Fuel className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{exp.description}</div>
                        <div className="text-slate-500 text-[10px]">{formatTime(exp.timestamp)} • {exp.category.toUpperCase()}</div>
                      </div>
                    </div>
                    <span className="font-bold text-amber-400 font-mono text-sm">
                      {formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Settlement Validation Form */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white font-heading">
              Aprobación y Rendición
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ingresa el dinero físico entregado por el repartidor en la caja central para validar el cierre.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Efectivo Físico Recibido ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={cashHandedIn}
                  placeholder={settlement.netCashDueToBakery.toString()}
                  onChange={(e) => setCashHandedIn(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl glass-input text-base font-bold font-mono"
                />
              </div>
            </div>

            {/* Difference Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                cashDiff === 0
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : cashDiff < 0
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-sky-950/30 border-sky-500/40 text-sky-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {cashDiff === 0 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span className="font-semibold">
                  {cashDiff === 0
                    ? 'Efectivo Coincide Exacto'
                    : cashDiff < 0
                    ? 'Faltante de Caja'
                    : 'Sobrante en Caja'}
                </span>
              </div>
              <span className="font-bold font-mono text-sm">
                {cashDiff > 0 ? `+${formatCurrency(cashDiff)}` : formatCurrency(cashDiff)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notas / Observaciones de Cierre
              </label>
              <textarea
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
                placeholder="Ej: Se descontaron $1.000 de propina autorizada o billete falso..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            {closureSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-center font-bold text-sm animate-bounce">
                🎉 ¡Liquidación Diaria Aprobada y Guardada en Historial!
              </div>
            ) : (
              <button
                onClick={handleApproveClosure}
                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Aprobar y Cerrar Jornada</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
