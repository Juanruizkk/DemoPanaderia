import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { calculateCashSettlementForDriver, calculateVanAuditForDriver } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  DollarSign,
  Fuel,
  Receipt,
  Truck,
  Send,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const DailyClosure = () => {
  const { activeDriverId, activeDriver, orders, expenses, products, vanMovements, addAuditLog } = useBakery();
  const [submitted, setSubmitted] = useState(false);

  const settlement = calculateCashSettlementForDriver(activeDriverId, orders, expenses);
  const vanAudit = calculateVanAuditForDriver(activeDriverId, products, vanMovements, orders);

  const handleDriverClosure = () => {
    addAuditLog(
      'SOLICITUD_CIERRE',
      'dinero',
      `Repartidor ${activeDriver.name} finalizó su ruta`,
      `Total a rendir: $${settlement.netCashDueToBakery} | Entregas: ${settlement.ordersCount} pedidos`,
      'info'
    );

    setSubmitted(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/80 mx-auto flex items-center justify-center text-2xl shadow-sm">
          🏁
        </div>
        <h3 className="text-xl font-bold text-white font-heading">
          Resumen de Cierre de Jornada ({activeDriver.name})
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Revisa el balance total de tu recorrido antes de entregar el dinero y la camioneta en la fábrica.
        </p>
      </div>

      {/* Summary Box */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-sans text-slate-300">Total Pedidos Entregados:</span>
            <span className="font-bold text-white text-sm">{settlement.ordersCount} clientes</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="font-sans text-slate-300">Total Facturado en Calle:</span>
            <span className="font-bold text-white text-sm">{formatCurrency(settlement.totalBilled)}</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
            <span className="font-sans">Efectivo Cobrado en Mano:</span>
            <span className="font-bold text-sm text-emerald-400">+{formatCurrency(settlement.totalCashCollected)}</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
            <span className="font-sans">Cobranzas por Transferencia:</span>
            <span className="font-bold text-sm text-slate-300">{formatCurrency(settlement.totalTransferCollected)}</span>
          </div>

          <div className="flex justify-between items-center p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-200">
            <span className="font-sans">Gastos de Combustible / Viáticos:</span>
            <span className="font-bold text-sm text-slate-400">-{formatCurrency(settlement.cashExpenses)}</span>
          </div>

          <div className="h-px bg-slate-800 my-2" />

          {/* Grand Total to hand in */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block font-sans">
                Efectivo Neto a Rendir en Fábrica:
              </span>
              <span className="text-[11px] text-slate-400 font-sans font-normal">
                Efectivo cobrado menos gastos de nafta
              </span>
            </div>
            <span className="text-3xl font-extrabold text-white font-mono">
              {formatCurrency(settlement.netCashDueToBakery)}
            </span>
          </div>
        </div>

        {/* Stock status check */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">Estado de Descarga de Camioneta:</span>
          </div>
          {vanAudit.isClean ? (
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="w-3 h-3" />
              <span>Mercadería Cuadrada</span>
            </Badge>
          ) : (
            <Badge variant="rose" size="sm">
              <AlertTriangle className="w-3 h-3" />
              <span>{vanAudit.totalFaltantesUnidades} un. por verificar</span>
            </Badge>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-bold text-sm">
              ✓ Cierre de ruta notificado a Administración. Entrega el efectivo en mostrador.
            </div>
          ) : (
            <button
              onClick={handleDriverClosure}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-slate-950 bg-slate-100 hover:bg-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Finalizar Ruta & Enviar Rendición</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
