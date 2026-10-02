import React, { useState, useEffect } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { PRODUCT_CATEGORIES } from '../../data/productCatalog';
import { formatCurrency } from '../../utils/formatters';
import { generateWhatsAppReceipt } from '../../utils/exportHelper';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import {
  Plus,
  Minus,
  DollarSign,
  MessageCircle,
  CreditCard,
  AlertCircle,
  Check,
  Package,
  Layers
} from 'lucide-react';

export const OrderModal = ({ isOpen, onClose, client, existingOrder = null }) => {
  const { products, priceLists, productsMap, activeDriverId, addOrder, updateOrder } = useBakery();

  const [quantities, setQuantities] = useState({}); // { [productId]: number }
  const [detailNotes, setDetailNotes] = useState({}); // { [productId]: string }
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo'); // 'efectivo', 'transferencia'
  const [notes, setNotes] = useState('');
  const [activeCategoryTab, setActiveCategoryTab] = useState(PRODUCT_CATEGORIES.FRESCOS);
  const [pendingWhatsApp, setPendingWhatsApp] = useState(null); // null | true | false

  const clientPriceListId = client?.priceListId || 'reparto';
  const clientPriceList = priceLists.find((pl) => pl.id === clientPriceListId);

  // Inicializar formulario si hay pedido existente o al abrir nuevo
  useEffect(() => {
    if (existingOrder) {
      const qMap = {};
      const nMap = {};
      existingOrder.items?.forEach((item) => {
        qMap[item.productId] = item.quantity;
        if (item.detailNotes) nMap[item.productId] = item.detailNotes;
      });
      setQuantities(qMap);
      setDetailNotes(nMap);
      setPaidAmount(existingOrder.paidAmount?.toString() || '');
      setPaymentMethod(existingOrder.paymentMethod || 'efectivo');
      setNotes(existingOrder.notes || '');
    } else {
      setQuantities({});
      setDetailNotes({});
      setPaidAmount('');
      setPaymentMethod('efectivo');
      setNotes('');
    }
  }, [existingOrder, isOpen]);

  // Manejar cambio de cantidades
  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  };

  const handleDirectQuantityInput = (productId, value) => {
    const num = Math.max(0, Number(value) || 0);
    setQuantities((prev) => {
      if (num === 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: num };
    });
  };

  // Calcular subtotal y total
  const orderItems = Object.entries(quantities).map(([prodId, qty]) => {
    const prod = productsMap[prodId];
    const unitPrice = prod?.prices?.[clientPriceListId] || prod?.basePrice || 0;
    const subtotal = qty * unitPrice;
    return {
      productId: prodId,
      quantity: qty,
      unitPrice,
      subtotal,
      detailNotes: detailNotes[prodId] || ''
    };
  });

  const totalAmount = orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  const enteredPayment = paidAmount === '' ? totalAmount : Number(paidAmount);
  
  // Saldo deudor resultante
  const initialDebt = Number(client?.initialDebt || 0);
  const remainingDebt = Math.max(0, initialDebt + totalAmount - enteredPayment);

  const handleSaveOrder = (sendWhatsApp = false) => {
    if (orderItems.length === 0 && Number(paidAmount) <= 0) {
      alert('Por favor ingrese al menos un producto o un pago.');
      return;
    }
    // Mostrar confirmación
    setPendingWhatsApp(sendWhatsApp);
  };

  const handleConfirmSave = () => {
    const sendWhatsApp = pendingWhatsApp;
    setPendingWhatsApp(null);

    const orderData = {
      driverId: activeDriverId,
      clientId: client.id,
      items: orderItems,
      totalAmount,
      paidAmount: enteredPayment,
      paymentMethod,
      notes,
    };

    let savedOrder;
    if (existingOrder) {
      updateOrder(existingOrder.id, orderData);
      savedOrder = { ...existingOrder, ...orderData };
    } else {
      savedOrder = addOrder(orderData);
    }

    if (sendWhatsApp && client?.phone) {
      const encodedMsg = generateWhatsAppReceipt(client, savedOrder, productsMap, remainingDebt);
      window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${encodedMsg}`, '_blank');
    }

    onClose();
  };

  const categoryProducts = products.filter((p) => p.category === activeCategoryTab);

  return (
    <Modal
      isOpen={isOpen}
      onClose={pendingWhatsApp !== null ? undefined : onClose}
      title={`Entrega: ${client?.name || 'Cliente'}`}
      subtitle={`Lista: ${clientPriceList?.name || 'Reparto'} • Saldo Previo: ${formatCurrency(initialDebt)}`}
      maxWidth="max-w-3xl"
    >
      {/* Confirmation Overlay */}
      {pendingWhatsApp !== null && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm rounded-2xl p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xs w-full space-y-4 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="text-2xl text-slate-300">✓</div>
              <h3 className="text-base font-bold text-white">Confirmar entrega</h3>
              <p className="text-xs text-slate-400">{client?.name}</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Total pedido</span>
                <span className="font-bold text-white font-mono">{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Cobrado</span>
                <span className="font-bold text-emerald-400 font-mono">{formatCurrency(enteredPayment)}</span>
              </div>
              {remainingDebt > 0 && (
                <div className="flex justify-between text-slate-300">
                  <span>Queda a deber</span>
                  <span className="font-bold text-rose-400 font-mono">{formatCurrency(remainingDebt)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                <span>Forma de pago</span>
                <span className="font-bold text-white capitalize">{paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setPendingWhatsApp(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                Volver
              </button>
              <button
                onClick={handleConfirmSave}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 transition-colors shadow-sm"
              >
                {pendingWhatsApp ? 'Guardar & WA' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveCategoryTab(PRODUCT_CATEGORIES.FRESCOS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategoryTab === PRODUCT_CATEGORIES.FRESCOS
                ? 'bg-slate-100 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Panadería & Frescos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategoryTab(PRODUCT_CATEGORIES.DETALLE)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategoryTab === PRODUCT_CATEGORIES.DETALLE
                ? 'bg-slate-100 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Detalle & Envasados</span>
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
          {categoryProducts.map((prod) => {
            const qty = quantities[prod.id] || 0;
            const unitPrice = prod.prices?.[clientPriceListId] || prod.basePrice;
            const isFactura = prod.id === 'facturas';
            const isTortilla = prod.id.includes('tortilla');

            return (
              <div
                key={prod.id}
                className={`p-3 rounded-xl border transition-all ${
                  qty > 0
                    ? 'bg-slate-850 border-slate-600 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{prod.icon}</span>
                    <div>
                      <div className="font-bold text-white text-xs">{prod.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatCurrency(unitPrice)} / {prod.unit}
                      </div>
                    </div>
                  </div>

                  {/* Increment/Decrement controls */}
                  <div className="flex items-center gap-1 bg-slate-950 rounded-lg p-1 border border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(prod.id, -1)}
                      className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold text-sm transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={qty || ''}
                      placeholder="0"
                      onChange={(e) => handleDirectQuantityInput(prod.id, e.target.value)}
                      onWheel={(e) => e.target.blur()}
                      className="w-10 text-center text-xs font-bold text-white bg-transparent outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(prod.id, 1)}
                      className="w-7 h-7 rounded bg-slate-100 hover:bg-white text-slate-950 flex items-center justify-center font-bold text-sm transition-colors shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Optional note for Facturas or Tortillas (e.g. 15 crem - 15 dulce) */}
                {(isFactura || isTortilla || qty > 0) && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60">
                    <input
                      type="text"
                      placeholder="Detalle (ej: 15crem - 15f o surtidas)..."
                      value={detailNotes[prod.id] || ''}
                      onChange={(e) =>
                        setDetailNotes({ ...detailNotes, [prod.id]: e.target.value })
                      }
                      className="w-full px-2 py-1 text-[11px] rounded glass-input text-slate-300 placeholder:text-slate-600"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Order Summary & Payment Box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Total Pedido Hoy
              </span>
              <span className="text-xl font-extrabold text-white font-heading">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Saldo Previo
              </span>
              <span className="text-xl font-bold text-slate-300 font-heading">
                {formatCurrency(initialDebt)}
              </span>
            </div>

            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                Saldo Deudor Final
              </span>
              <span className="text-xl font-extrabold text-rose-400 font-heading">
                {formatCurrency(remainingDebt)}
              </span>
            </div>
          </div>

          {/* Payment Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Monto Cobrado Hoy ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  placeholder={totalAmount.toString()}
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl glass-input text-base font-bold font-mono text-emerald-400"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setPaidAmount(totalAmount.toString())}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                >
                  Paga Total Hoy ({formatCurrency(totalAmount)})
                </button>
                <button
                  type="button"
                  onClick={() => setPaidAmount('0')}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 hover:text-rose-200 border border-slate-700 transition-colors"
                >
                  Fiado ($0)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Forma de Pago
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('efectivo')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    paymentMethod === 'efectivo'
                      ? 'bg-slate-100 text-slate-950 border-slate-200 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  💵 Efectivo
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transferencia')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    paymentMethod === 'transferencia'
                      ? 'bg-slate-100 text-slate-950 border-slate-200 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  📱 Transferencia
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleSaveOrder(true)}
              className="flex-1 sm:flex-initial px-4 py-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Guardar & WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => handleSaveOrder(false)}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Entrega</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
