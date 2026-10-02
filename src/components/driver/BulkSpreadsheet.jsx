import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  FileSpreadsheet,
  Save,
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const BulkSpreadsheet = () => {
  const { clients, orders, activeDriverId, productsMap, addOrder, updateOrder } = useBakery();
  const [saveToast, setSaveToast] = useState(false);

  const driverClients = clients.filter((c) => c.driverId === activeDriverId);

  // Mapear los valores actuales de cada cliente
  const getOrderData = (clientId) => {
    return orders.find((o) => o.clientId === clientId && o.driverId === activeDriverId && o.status === 'delivered');
  };

  const handleCellChange = (clientId, productId, value, detailNotes = null) => {
    const qty = Math.max(0, Number(value) || 0);
    const existing = getOrderData(clientId);
    const client = clients.find((c) => c.id === clientId);
    const clientPriceListId = client?.priceListId || 'reparto';

    let currentItems = existing?.items ? [...existing.items] : [];
    const itemIndex = currentItems.findIndex((i) => i.productId === productId);

    if (qty > 0) {
      const prod = productsMap[productId];
      const unitPrice = prod?.prices?.[clientPriceListId] || prod?.basePrice || 0;
      const newItem = {
        productId,
        quantity: qty,
        unitPrice,
        subtotal: qty * unitPrice,
        detailNotes: detailNotes !== null ? detailNotes : currentItems[itemIndex]?.detailNotes || ''
      };

      if (itemIndex >= 0) {
        currentItems[itemIndex] = newItem;
      } else {
        currentItems.push(newItem);
      }
    } else {
      if (itemIndex >= 0) {
        currentItems.splice(itemIndex, 1);
      }
    }

    const totalAmount = currentItems.reduce((acc, i) => acc + i.subtotal, 0);
    const paidAmount = existing?.paidAmount !== undefined ? existing.paidAmount : totalAmount;

    const orderPayload = {
      driverId: activeDriverId,
      clientId,
      items: currentItems,
      totalAmount,
      paidAmount: paidAmount,
      paymentMethod: existing?.paymentMethod || 'efectivo',
      notes: existing?.notes || ''
    };

    if (existing) {
      updateOrder(existing.id, orderPayload);
    } else if (currentItems.length > 0) {
      addOrder(orderPayload);
    }
  };

  const handlePaidChange = (clientId, value) => {
    const paid = Math.max(0, Number(value) || 0);
    const existing = getOrderData(clientId);
    if (existing) {
      updateOrder(existing.id, { paidAmount: paid });
    }
  };

  // Totales de columna para el pie de tabla
  let sumPanFra = 0;
  let sumPanX2 = 0;
  let sumPanX3 = 0;
  let sumPanMig = 0;
  let sumPanNeg = 0;
  let sumPanTotal = 0;

  let sumTorHor = 0;
  let sumTorCru = 0;
  let sumTorTotal = 0;

  let sumFactTotal = 0;
  let sumTotalBilled = 0;
  let sumTotalPaid = 0;

  driverClients.forEach((c) => {
    const ord = getOrderData(c.id);
    if (ord) {
      sumTotalBilled += ord.totalAmount || 0;
      sumTotalPaid += ord.paidAmount || 0;
      ord.items?.forEach((item) => {
        if (item.productId === 'pan-frances') { sumPanFra += item.quantity; sumPanTotal += item.quantity; }
        if (item.productId === 'pan-x2') { sumPanX2 += item.quantity; sumPanTotal += item.quantity; }
        if (item.productId === 'pan-x3') { sumPanX3 += item.quantity; sumPanTotal += item.quantity; }
        if (item.productId === 'pan-miga') { sumPanMig += item.quantity; sumPanTotal += item.quantity; }
        if (item.productId === 'pan-negro') { sumPanNeg += item.quantity; sumPanTotal += item.quantity; }
        if (item.productId === 'tortillas-horno') { sumTorHor += item.quantity; sumTorTotal += item.quantity; }
        if (item.productId === 'tortillas-crudas') { sumTorCru += item.quantity; sumTorTotal += item.quantity; }
        if (item.productId === 'facturas') { sumFactTotal += item.quantity; }
      });
    }
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
            <FileSpreadsheet className="w-5 h-5 text-slate-300" />
            <span>Planilla Digital Masiva (Estilo Planilla de Reparto)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Carga rápida en cuadrícula. Los cambios se guardan automáticamente y actualizan el stock de la camioneta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="neutral" size="md">
            <span>Auto-guardado activo</span>
          </Badge>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-left text-xs border-collapse">
            {/* Top Multi-Header (Similar a pedidosrepartidores.jpg) */}
            <thead className="bg-slate-900 text-slate-300 font-semibold text-[11px] sticky top-0 z-20 border-b border-slate-700 shadow-sm">
              <tr>
                <th rowSpan={2} className="px-3 py-3 border-r border-slate-800 bg-slate-900 text-slate-400 w-24">
                  Saldo Ant.
                </th>
                <th rowSpan={2} className="px-4 py-3 border-r border-slate-800 bg-slate-900 text-white min-w-[140px] sticky left-0 z-30 shadow-md">
                  Cliente
                </th>
                <th colSpan={6} className="px-3 py-2 text-center border-r border-slate-800 bg-slate-800/80 text-slate-200">
                  🍞 PAN
                </th>
                <th colSpan={3} className="px-3 py-2 text-center border-r border-slate-800 bg-slate-800/80 text-slate-200">
                  🫓 TORTILLA
                </th>
                <th colSpan={2} className="px-3 py-2 text-center border-r border-slate-800 bg-slate-800/80 text-slate-200">
                  🥐 FACTURA
                </th>
                <th rowSpan={2} className="px-3 py-3 text-right border-r border-slate-800 bg-slate-900 text-slate-300">
                  Total $
                </th>
                <th rowSpan={2} className="px-3 py-3 text-right border-r border-slate-800 bg-slate-900 text-slate-300">
                  Cobrado $
                </th>
                <th rowSpan={2} className="px-3 py-3 text-right bg-slate-900 text-rose-400">
                  Saldo Deudor
                </th>
              </tr>
              <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[10px]">
                {/* Pan subheaders */}
                <th className="px-2 py-1.5 text-center bg-slate-900 text-white font-bold">Total</th>
                <th className="px-2 py-1.5 text-center">Fra</th>
                <th className="px-2 py-1.5 text-center">x2</th>
                <th className="px-2 py-1.5 text-center">x3</th>
                <th className="px-2 py-1.5 text-center">Mig</th>
                <th className="px-2 py-1.5 text-center border-r border-slate-800">Neg</th>

                {/* Tortilla subheaders */}
                <th className="px-2 py-1.5 text-center">Hor</th>
                <th className="px-2 py-1.5 text-center">Cru</th>
                <th className="px-3 py-1.5 text-left border-r border-slate-800 min-w-[120px]">Detalle</th>

                {/* Factura subheaders */}
                <th className="px-2 py-1.5 text-center">Cant</th>
                <th className="px-3 py-1.5 text-left border-r border-slate-800 min-w-[120px]">Detalle</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {driverClients.map((client) => {
                const ord = getOrderData(client.id);
                const getItemQty = (prodId) => ord?.items?.find((i) => i.productId === prodId)?.quantity || 0;
                const getItemNotes = (prodId) => ord?.items?.find((i) => i.productId === prodId)?.detailNotes || '';

                const qFra = getItemQty('pan-frances');
                const qX2 = getItemQty('pan-x2');
                const qX3 = getItemQty('pan-x3');
                const qMig = getItemQty('pan-miga');
                const qNeg = getItemQty('pan-negro');
                const totalPanRow = qFra + qX2 + qX3 + qMig + qNeg;

                const qTorHor = getItemQty('tortillas-horno');
                const qTorCru = getItemQty('tortillas-crudas');
                const torNotes = getItemNotes('tortillas-horno') || getItemNotes('tortillas-crudas');

                const qFact = getItemQty('facturas');
                const factNotes = getItemNotes('facturas');

                const initialDebt = Number(client.initialDebt || 0);
                const billed = ord?.totalAmount || 0;
                const paid = ord?.paidAmount || 0;
                const totalDebt = Math.max(0, initialDebt + billed - paid);

                return (
                  <tr key={client.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Saldo Anterior */}
                    <td className="px-3 py-2 border-r border-slate-800 font-mono text-slate-400">
                      {initialDebt > 0 ? (
                        <span className="text-slate-300 font-semibold">{formatCurrency(initialDebt)}</span>
                      ) : (
                        '-'
                      )}
                    </td>

                    {/* Cliente */}
                    <td className="px-4 py-2 border-r border-slate-800 font-bold text-white sticky left-0 bg-slate-900/90 z-10">
                      {client.name}
                    </td>

                    {/* Pan Total */}
                    <td className="px-2 py-1 text-center bg-slate-900/60 font-bold text-white border-r border-slate-800/40">
                      {totalPanRow || '-'}
                    </td>

                    {/* Pan Francés */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qFra || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'pan-frances', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Pan x2 */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qX2 || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'pan-x2', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Pan x3 */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qX3 || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'pan-x3', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Pan Miga */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qMig || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'pan-miga', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Pan Negro */}
                    <td className="px-1 py-1 text-center border-r border-slate-800">
                      <input
                        type="number"
                        min="0"
                        value={qNeg || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'pan-negro', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Tortilla Horno */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qTorHor || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'tortillas-horno', e.target.value)}
                        className="w-12 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Tortilla Cruda */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qTorCru || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'tortillas-crudas', e.target.value)}
                        className="w-12 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Tortilla Detalle */}
                    <td className="px-2 py-1 border-r border-slate-800">
                      <input
                        type="text"
                        placeholder="15crem - 15f"
                        value={torNotes}
                        onChange={(e) =>
                          handleCellChange(client.id, 'tortillas-horno', qTorHor, e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 text-[11px] text-slate-300"
                      />
                    </td>

                    {/* Facturas Cant */}
                    <td className="px-1 py-1 text-center">
                      <input
                        type="number"
                        min="0"
                        value={qFact || ''}
                        placeholder="-"
                        onChange={(e) => handleCellChange(client.id, 'facturas', e.target.value)}
                        className="w-11 text-center py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 font-mono font-bold text-xs text-slate-100"
                      />
                    </td>

                    {/* Facturas Detalle */}
                    <td className="px-2 py-1 border-r border-slate-800">
                      <input
                        type="text"
                        placeholder="surtidas / 4c-4d"
                        value={factNotes}
                        onChange={(e) =>
                          handleCellChange(client.id, 'facturas', qFact, e.target.value)
                        }
                        className="w-full px-2 py-1 rounded bg-slate-950/60 border border-slate-800 focus:border-slate-500 text-[11px] text-slate-300"
                      />
                    </td>

                    {/* Total Venta */}
                    <td className="px-3 py-2 text-right border-r border-slate-800 font-mono font-bold text-white">
                      {billed > 0 ? formatCurrency(billed) : '-'}
                    </td>

                    {/* Cobrado */}
                    <td className="px-2 py-1 text-right border-r border-slate-800">
                      <input
                        type="number"
                        min="0"
                        value={paid || ''}
                        placeholder="0"
                        onChange={(e) => handlePaidChange(client.id, e.target.value)}
                        className="w-20 text-right py-1 px-2 rounded bg-slate-950/60 border border-slate-800 focus:border-emerald-500 font-mono font-bold text-emerald-400 text-xs"
                      />
                    </td>

                    {/* Saldo Deudor Final */}
                    <td className="px-3 py-2 text-right font-mono">
                      {totalDebt > 0 ? (
                        <span className="text-rose-400 font-bold">{formatCurrency(totalDebt)}</span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">$0</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totales del Pie de Tabla */}
            <tfoot className="bg-slate-900 border-t-2 border-slate-700 font-mono text-xs font-bold text-white sticky bottom-0 z-20 shadow-lg">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-slate-300 font-sans text-xs uppercase font-extrabold sticky left-0 bg-slate-900">
                  TOTALES DE RUTA HOY:
                </td>
                <td className="px-2 py-3 text-center bg-slate-800/80 text-white text-sm">{sumPanTotal}</td>
                <td className="px-2 py-3 text-center text-slate-200">{sumPanFra}</td>
                <td className="px-2 py-3 text-center text-slate-200">{sumPanX2}</td>
                <td className="px-2 py-3 text-center text-slate-200">{sumPanX3}</td>
                <td className="px-2 py-3 text-center text-slate-200">{sumPanMig}</td>
                <td className="px-2 py-3 text-center border-r border-slate-800 text-slate-200">{sumPanNeg}</td>

                <td className="px-2 py-3 text-center text-slate-200">{sumTorHor}</td>
                <td className="px-2 py-3 text-center text-slate-200">{sumTorCru}</td>
                <td className="px-2 py-3 text-center border-r border-slate-800 text-slate-400 font-sans font-normal text-[10px]">
                  {sumTorTotal} tot.
                </td>

                <td className="px-2 py-3 text-center text-slate-200">{sumFactTotal}</td>
                <td className="px-2 py-3 border-r border-slate-800"></td>

                <td className="px-3 py-3 text-right border-r border-slate-800 text-white font-extrabold text-sm">
                  {formatCurrency(sumTotalBilled)}
                </td>
                <td className="px-3 py-3 text-right border-r border-slate-800 text-emerald-400 font-extrabold text-sm">
                  {formatCurrency(sumTotalPaid)}
                </td>
                <td className="px-3 py-3 text-right text-rose-400">
                  {formatCurrency(Math.max(0, sumTotalBilled - sumTotalPaid))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
