import { formatCurrency, formatDate } from './formatters';

export const generateWhatsAppReceipt = (client, order, productsMap, currentDebt) => {
  const dateStr = formatDate(order.date || new Date().toISOString());
  
  let text = `🥖 *PANADERÍA DIPIETRO* 🥖\n`;
  text += `*Comprobante de Entrega*\n`;
  text += `📅 Fecha: ${dateStr}\n`;
  text += `👤 Cliente: ${client.name}\n`;
  text += `--------------------------------\n`;
  text += `*DETALLE DEL PEDIDO:*\n`;

  order.items.forEach(item => {
    const prod = productsMap[item.productId];
    const name = prod ? prod.name : item.productId;
    const sub = formatCurrency(item.subtotal);
    const unitP = formatCurrency(item.unitPrice);
    const notes = item.detailNotes ? ` (${item.detailNotes})` : '';
    text += `• ${item.quantity}x ${name}${notes} a ${unitP} = ${sub}\n`;
  });

  text += `--------------------------------\n`;
  text += `*Total Pedido:* ${formatCurrency(order.totalAmount)}\n`;
  text += `*Monto Abonado:* ${formatCurrency(order.paidAmount)} (${order.paymentMethod.toUpperCase()})\n`;

  if (currentDebt > 0) {
    text += `⚠️ *Saldo Pendiente / Deuda Total:* ${formatCurrency(currentDebt)}\n`;
  } else {
    text += `✅ *Cuenta al día (Saldo $0)*\n`;
  }

  text += `--------------------------------\n`;
  text += `¡Muchas gracias por su compra!`;

  return encodeURIComponent(text);
};

export const exportAuditToCSV = (driverName, auditRows, cashSettlement) => {
  let csv = `AUDITORIA DE CAMIONETA - ${driverName.toUpperCase()}\n`;
  csv += `Fecha,${new Date().toLocaleDateString('es-AR')}\n\n`;
  csv += `Producto,Carga,Recarga,Cambios,Descarga,Vendido Fisico,Entregado Clientes,Diferencia,Estado\n`;

  auditRows.forEach(r => {
    const estado = r.diferencia === 0 ? 'CORRECTO' : r.diferencia < 0 ? `FALTANTE (-${Math.abs(r.diferencia)})` : `SOBRANTE (+${r.diferencia})`;
    csv += `"${r.product.name}",${r.carga},${r.recarga},${r.cambios},${r.descarga},${r.teoricoVendido},${r.entregadoRegistrado},${r.diferencia},"${estado}"\n`;
  });

  csv += `\nRENDICION DE CAJA\n`;
  csv += `Total Facturado,${cashSettlement.totalBilled}\n`;
  csv += `Cobrado en Efectivo,${cashSettlement.totalCashCollected}\n`;
  csv += `Cobrado en Transferencia,${cashSettlement.totalTransferCollected}\n`;
  csv += `Gastos del Repartidor,${cashSettlement.totalExpenses}\n`;
  csv += `EFECTIVO NETO A RENDIR EN FABRICA,${cashSettlement.netCashDueToBakery}\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `auditoria_${driverName.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
