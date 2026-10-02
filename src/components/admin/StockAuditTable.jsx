import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { calculateVanAuditForDriver } from '../../utils/calculations';
import { formatCurrency } from '../../utils/formatters';
import { exportAuditToCSV } from '../../utils/exportHelper';
import { Badge } from '../common/Badge';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Info,
  Truck
} from 'lucide-react';

export const StockAuditTable = () => {
  const { drivers, products, vanMovements, orders, activeCashSettlement } = useBakery();
  const [selectedDriverId, setSelectedDriverId] = useState('rep-1');
  const [filterOnlyDiscrepancies, setFilterOnlyDiscrepancies] = useState(false);

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const auditData = calculateVanAuditForDriver(selectedDriverId, products, vanMovements, orders);

  const displayedRows = filterOnlyDiscrepancies
    ? auditData.rows.filter((r) => r.diferencia !== 0)
    : auditData.rows;

  const handleExport = () => {
    exportAuditToCSV(selectedDriver.name, auditData.rows, activeCashSettlement);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Explanation Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Driver Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          {drivers.map((driver) => {
            const driverAudit = calculateVanAuditForDriver(driver.id, products, vanMovements, orders);
            const hasAlerts = driverAudit.totalFaltantesUnidades > 0;
            return (
              <button
                key={driver.id}
                onClick={() => setSelectedDriverId(driver.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedDriverId === driver.id
                    ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{driver.name}</span>
                {hasAlerts && (
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Toggle & Export Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700">
            <input
              type="checkbox"
              checked={filterOnlyDiscrepancies}
              onChange={(e) => setFilterOnlyDiscrepancies(e.target.checked)}
              className="rounded border-slate-700 text-slate-300 focus:ring-slate-600 bg-slate-800"
            />
            <span>Solo mostrar desvíos / diferencias</span>
          </label>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Formula Explanation Callout */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 bg-slate-900/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700/60 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-0.5 font-heading text-sm">
            Fórmula de Auditoría en Tiempo Real
          </span>
          <span className="text-slate-200 font-mono font-semibold">
            [Carga Inicial] + [Recargas] - [Cambios s/costo] - [Descarga al volver] = Stock Vendido Físico
          </span>
          . El sistema cruza este número contra los pedidos registrados a clientes. Si la diferencia es negativa, existe un{' '}
          <strong className="text-rose-400">faltante injustificado de mercadería</strong>.
        </div>
      </div>

      {/* KPI Cards for Audit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`glass-card rounded-2xl p-4 border ${auditData.totalFaltantesUnidades > 0 ? 'border-rose-500/20 bg-rose-950/10' : 'border-slate-800'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase">Estado de Camioneta</span>
            {auditData.isClean ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            )}
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {auditData.isClean ? '100% Cuadrado' : `${auditData.totalFaltantesUnidades} un. Faltantes`}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {auditData.isClean ? 'No hay desvíos de mercadería detectados.' : 'Mercadería salida sin comprobante de venta.'}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Riesgo Monetario Faltante</span>
          <div className="text-2xl font-bold text-rose-400 mt-1 font-heading">
            {formatCurrency(auditData.totalPerdidaMonetaria)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Valor de costo/venta de los productos no justificados.
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Productos con Movimiento</span>
          <div className="text-2xl font-bold text-white mt-1 font-heading">
            {auditData.rows.length} variedades
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Ítems cargados en la camioneta {selectedDriver.vehicle.split('-')[0]}.
          </div>
        </div>
      </div>

      {/* Audit Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Producto</th>
                <th className="px-3 py-3.5 text-center text-slate-300">Carga (+)</th>
                <th className="px-3 py-3.5 text-center text-slate-300">Recarga (+)</th>
                <th className="px-3 py-3.5 text-center text-slate-300">Cambios (-)</th>
                <th className="px-3 py-3.5 text-center text-slate-300">Descarga (-)</th>
                <th className="px-3 py-3.5 text-center font-bold text-white bg-slate-800/40">Vendido Físico</th>
                <th className="px-3 py-3.5 text-center font-bold text-emerald-400 bg-emerald-950/20">Entregado Real</th>
                <th className="px-3 py-3.5 text-center font-bold">Diferencia</th>
                <th className="px-4 py-3.5 text-right">Riesgo ($)</th>
                <th className="px-4 py-3.5 text-center">Auditoría</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron desvíos en los productos analizados.
                  </td>
                </tr>
              ) : (
                displayedRows.map((row) => {
                  const isMissing = row.diferencia < 0;
                  const isSurplus = row.diferencia > 0;
                  const isOk = row.diferencia === 0;

                  return (
                    <tr
                      key={row.product.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isMissing
                          ? 'bg-rose-950/10'
                          : isSurplus
                          ? 'bg-slate-800/20'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{row.product.icon}</span>
                          <div>
                            <div className="font-bold text-white">{row.product.name}</div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {row.product.unit} • {formatCurrency(row.product.basePrice)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3 text-center text-slate-300 font-semibold">{row.carga || '-'}</td>
                      <td className="px-3 py-3 text-center text-slate-300 font-semibold">{row.recarga || '-'}</td>
                      <td className="px-3 py-3 text-center text-slate-300 font-semibold">{row.cambios || '-'}</td>
                      <td className="px-3 py-3 text-center text-slate-300 font-semibold">{row.descarga || '-'}</td>

                      {/* Vendido Físico Teórico */}
                      <td className="px-3 py-3 text-center font-bold text-white bg-slate-800/40">
                        {row.teoricoVendido}
                      </td>

                      {/* Entregado Real a Clientes */}
                      <td className="px-3 py-3 text-center font-bold text-emerald-400 bg-emerald-950/20">
                        {row.entregadoRegistrado}
                      </td>

                      {/* Diferencia */}
                      <td className="px-3 py-3 text-center font-bold">
                        {isOk && <span className="text-slate-400 font-normal">0</span>}
                        {isMissing && (
                          <span className="text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
                            {row.diferencia}
                          </span>
                        )}
                        {isSurplus && (
                          <span className="text-slate-300 font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                            +{row.diferencia}
                          </span>
                        )}
                      </td>

                      {/* Valor Pérdida */}
                      <td className="px-4 py-3 text-right font-mono">
                        {row.valorPerdida > 0 ? (
                          <span className="text-rose-400 font-bold">
                            {formatCurrency(row.valorPerdida)}
                          </span>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Badge de Estado */}
                      <td className="px-4 py-3 text-center">
                        {isOk && <Badge variant="emerald">Cuadrado</Badge>}
                        {isMissing && <Badge variant="rose">Faltante</Badge>}
                        {isSurplus && <Badge variant="neutral">Sobrante</Badge>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
