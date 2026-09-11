import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { calculateVanAuditForDriver } from '../../utils/calculations';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Truck, Package, CheckCircle2, AlertTriangle, BatteryCharging } from 'lucide-react';

export const VanStockView = () => {
  const { activeDriverId, activeDriver, products, vanMovements, orders } = useBakery();
  const auditData = calculateVanAuditForDriver(activeDriverId, products, vanMovements, orders);

  const activeProducts = auditData.rows;

  return (
    <div className="space-y-6">
      {/* Top Van Header */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white font-heading">
                Stock Móvil en Camioneta ({activeDriver.vehicle.split('-')[0]})
              </h3>
              <Badge variant="sky" size="sm">En Vivo</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Inventario disponible restante en la camioneta a medida que vas entregando pedidos.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Variedades en Reparto
          </span>
          <span className="text-xl font-extrabold text-amber-400 font-mono">
            {activeProducts.length} productos
          </span>
        </div>
      </div>

      {/* Grid of Products in Van */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeProducts.length === 0 ? (
          <div className="col-span-3 glass-panel p-8 text-center text-slate-500 rounded-2xl text-xs">
            No se han registrado cargas para esta camioneta hoy en la planilla de fábrica.
          </div>
        ) : (
          activeProducts.map((row) => {
            const initialAvailable = row.totalSalida;
            const remaining = row.stockActualEnCamioneta;
            const delivered = row.entregadoRegistrado;
            const percentRemaining = initialAvailable > 0 ? Math.round((remaining / initialAvailable) * 100) : 0;

            return (
              <div
                key={row.product.id}
                className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{row.product.icon}</span>
                    <div>
                      <h4 className="font-bold text-white text-sm font-heading">
                        {row.product.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {row.product.unit}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-2xl font-black text-amber-400">
                      {remaining}
                    </span>
                    <span className="text-[10px] text-slate-500 block">restantes</span>
                  </div>
                </div>

                {/* Progress Bar of Van stock */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Entregado: {delivered}</span>
                    <span>Carga Total: {initialAvailable}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        percentRemaining > 30 ? 'bg-amber-500' : percentRemaining > 0 ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                      style={{ width: `${percentRemaining}%` }}
                    />
                  </div>
                </div>

                {/* Breakdown details */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Carga: {row.carga}</span>
                  {row.recarga > 0 && <span className="text-cyan-400">Recarga: +{row.recarga}</span>}
                  {row.cambios > 0 && <span className="text-amber-400">Cambio: -{row.cambios}</span>}
                  {row.descarga > 0 && <span className="text-purple-400">Descarga: {row.descarga}</span>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
