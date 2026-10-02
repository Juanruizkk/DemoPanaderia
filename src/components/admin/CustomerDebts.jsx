import React, { useState, useMemo } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import {
  Users,
  Search,
  Plus,
  DollarSign,
  Phone,
  MapPin,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Truck,
  History,
  Receipt,
  Package,
  Clock,
  User,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CustomerDebts = () => {
  const { customerBalances, drivers, priceLists, productsMap, orders, addClient, addOrder } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [driverFilter, setDriverFilter] = useState('all');
  const [debtOnlyFilter, setDebtOnlyFilter] = useState(false);

  // Modales
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

  // Modal Historial de Movimientos
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedClientForHistory, setSelectedClientForHistory] = useState(null);

  // Formulario nuevo cliente
  const [newClientName, setNewClientName] = useState('');
  const [newClientContact, setNewClientContact] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientAddress, setNewClientAddress] = useState('');
  const [newClientDriverId, setNewClientDriverId] = useState('rep-1');
  const [newClientPriceListId, setNewClientPriceListId] = useState('reparto');
  const [newClientInitialDebt, setNewClientInitialDebt] = useState('0');

  const filteredClients = customerBalances.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDriver = driverFilter === 'all' || client.driverId === driverFilter;
    const matchesDebt = !debtOnlyFilter || client.currentDebt > 0;

    return matchesSearch && matchesDriver && matchesDebt;
  });

  const totalStreetDebt = customerBalances.reduce((acc, c) => acc + c.currentDebt, 0);
  const totalDebtorClients = customerBalances.filter((c) => c.currentDebt > 0).length;

  // Datos calculados para el historial del cliente seleccionado
  const clientHistoryData = useMemo(() => {
    if (!selectedClientForHistory) return null;
    const client = customerBalances.find((c) => c.id === selectedClientForHistory.id) || selectedClientForHistory;
    const clientOrders = orders.filter((o) => o.clientId === client.id);
    const driver = drivers.find((d) => d.id === client.driverId);
    const priceList = priceLists.find((pl) => pl.id === client.priceListId);
    const initialDebt = Number(client.initialDebt || 0);
    const totalBilled = clientOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
    const totalPaid = clientOrders.reduce((acc, o) => acc + Number(o.paidAmount || 0), 0);
    const currentDebt = initialDebt + totalBilled - totalPaid;

    return {
      client,
      orders: clientOrders,
      driver,
      priceList,
      initialDebt,
      totalBilled,
      totalPaid,
      currentDebt
    };
  }, [selectedClientForHistory, customerBalances, orders, drivers, priceLists]);

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    addClient({
      name: newClientName,
      contact: newClientContact,
      phone: newClientPhone || '+54 9 261 000-0000',
      address: newClientAddress,
      driverId: newClientDriverId,
      priceListId: newClientPriceListId,
      initialDebt: Number(newClientInitialDebt) || 0
    });

    setIsAddClientOpen(false);
    setNewClientName('');
    setNewClientContact('');
    setNewClientPhone('');
    setNewClientAddress('');
    setNewClientInitialDebt('0');
  };

  const handleRegisterPayment = (e) => {
    e.preventDefault();
    if (!selectedClientForPayment || !paymentAmount || Number(paymentAmount) <= 0) return;

    // Crear un registro de pago a cuenta
    addOrder({
      driverId: selectedClientForPayment.driverId,
      clientId: selectedClientForPayment.id,
      items: [],
      totalAmount: 0,
      paidAmount: Number(paymentAmount),
      paymentMethod,
      notes: `Cobranza de saldo / Pago a cuenta registrado desde Administración`
    });

    setIsPaymentModalOpen(false);
    setPaymentAmount('');
    setSelectedClientForPayment(null);
  };

  const sendWhatsAppReminder = (client) => {
    const text = encodeURIComponent(
      `Hola *${client.contact || client.name}* de Panadería DiPietro. Le recordamos que su saldo pendiente actual en cuenta corriente es de *${formatCurrency(client.currentDebt)}*. Saludos cordiales!`
    );
    window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const sendStatementWhatsApp = (data) => {
    if (!data) return;
    const { client, orders: clientOrders, currentDebt, totalBilled, totalPaid, initialDebt } = data;
    let msg = `🥖 *PANADERÍA DIPIETRO - ESTADO DE CUENTA*\n`;
    msg += `👤 Cliente: *${client.name}*\n`;
    if (client.contact) msg += `👤 Contacto: ${client.contact}\n`;
    if (client.address) msg += `📍 Dirección: ${client.address}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    if (initialDebt > 0) {
      msg += `Saldo Anterior / Inicial: ${formatCurrency(initialDebt)}\n`;
    }
    msg += `Total Compras Hoy: ${formatCurrency(totalBilled)}\n`;
    msg += `Total Pagado Hoy: ${formatCurrency(totalPaid)}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `*SALDO DEUDOR ACTUAL: ${formatCurrency(currentDebt)}*\n\n`;

    if (clientOrders.length > 0) {
      msg += `📋 *DETALLE DE MOVIMIENTOS:*\n`;
      clientOrders.forEach((o) => {
        const d = drivers.find((drv) => drv.id === o.driverId);
        const who = d ? d.name : 'Administración';
        const dateFormatted = formatDate(o.timestamp || o.date);
        const timeFormatted = o.timestamp ? formatTime(o.timestamp) : '';
        const orderShortage = Math.max(0, o.totalAmount - o.paidAmount);

        msg += `• *${o.totalAmount > 0 ? 'Entrega de Pedido' : 'Pago a Cuenta'}* (${dateFormatted} ${timeFormatted}):\n`;
        if (o.totalAmount > 0) {
          msg += `  - Total Pedido: ${formatCurrency(o.totalAmount)}\n`;
        }
        msg += `  - Cobrado por ${who}: ${formatCurrency(o.paidAmount)} (${o.paymentMethod})\n`;
        if (orderShortage > 0) {
          msg += `  - Quedó debiendo del pedido: ${formatCurrency(orderShortage)}\n`;
        }
        if (o.notes) {
          msg += `  - Obs: ${o.notes}\n`;
        }
      });
    }
    msg += `\n_Quedamos a su disposición. ¡Muchas gracias!_`;

    const text = encodeURIComponent(msg);
    window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-xs font-semibold uppercase">Deuda Total en Calle (Fiado)</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">
            {formatCurrency(totalStreetDebt)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {totalDebtorClients} clientes con saldo pendiente de pago
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase">Clientes Registrados</span>
            <Users className="w-5 h-5 text-slate-300" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">
            {customerBalances.length} clientes
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Distribuidos en {drivers.length} rutas de reparto
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-300 uppercase">Gestión de Cobranzas</span>
            <div className="text-sm font-medium text-slate-400 mt-1">
              Envía avisos de saldo por WhatsApp con un solo clic.
            </div>
          </div>
          <button
            onClick={() => setIsAddClientOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-white text-slate-950 flex items-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cliente, contacto o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
            className="glass-input text-xs rounded-xl px-3 py-2"
          >
            <option value="all">Todos los Repartidores</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700">
            <input
              type="checkbox"
              checked={debtOnlyFilter}
              onChange={(e) => setDebtOnlyFilter(e.target.checked)}
              className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
            />
            <span className="whitespace-nowrap">Solo con deuda</span>
          </label>
        </div>
      </div>

      {/* Customer Balances Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Cliente</th>
                <th className="px-4 py-3.5">Contacto / Dirección</th>
                <th className="px-3 py-3.5 text-center">Repartidor</th>
                <th className="px-3 py-3.5 text-center">Lista de Precios</th>
                <th className="px-3 py-3.5 text-right">Vendido Hoy</th>
                <th className="px-3 py-3.5 text-right">Pagado Hoy</th>
                <th className="px-4 py-3.5 text-right font-bold">Saldo Deudor</th>
                <th className="px-4 py-3.5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron clientes con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const driver = drivers.find((d) => d.id === client.driverId);
                  const priceList = priceLists.find((pl) => pl.id === client.priceListId);

                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        client.hasDebt ? 'bg-rose-950/10' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            setSelectedClientForHistory(client);
                            setIsHistoryModalOpen(true);
                          }}
                          className="text-left font-bold text-white hover:text-slate-300 transition-colors text-sm flex items-center gap-1.5 group"
                          title="Clic para ver historial de movimientos"
                        >
                          <span>{client.name}</span>
                          <History className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <div className="text-[10px] text-slate-400">ID: {client.id}</div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{client.phone}</span>
                        </div>
                        {client.address && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{client.address}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-3 text-center">
                        <Badge variant="neutral" size="sm">
                          {driver ? driver.name.split(' ')[0] : '-'}
                        </Badge>
                      </td>

                      <td className="px-3 py-3 text-center">
                        <Badge variant="amber" size="sm">
                          {priceList ? priceList.name.split(' ')[0] : 'Reparto'}
                        </Badge>
                      </td>

                      <td className="px-3 py-3 text-right font-mono text-slate-300">
                        {client.totalBilled > 0 ? formatCurrency(client.totalBilled) : '-'}
                      </td>

                      <td className="px-3 py-3 text-right font-mono text-emerald-400">
                        {client.totalPaid > 0 ? formatCurrency(client.totalPaid) : '-'}
                      </td>

                      {/* Saldo Deudor */}
                      <td className="px-4 py-3 text-right font-mono">
                        {client.hasDebt ? (
                          <span className="text-rose-400 font-extrabold text-sm px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30">
                            {formatCurrency(client.currentDebt)}
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Al día</span>
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Botón Ver Historial */}
                          <button
                            onClick={() => {
                              setSelectedClientForHistory(client);
                              setIsHistoryModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 border border-slate-700 transition-colors"
                            title="Ver Historial de Movimientos, Quién Cobró y Deuda"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          {/* Botón Registrar Cobro */}
                          <button
                            onClick={() => {
                              setSelectedClientForPayment(client);
                              setIsPaymentModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-slate-700 transition-colors"
                            title="Registrar Cobro / Pago a Cuenta"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          {/* Botón Enviar WhatsApp */}
                          {client.hasDebt && (
                            <button
                              onClick={() => sendWhatsAppReminder(client)}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors"
                              title="Enviar recordatorio por WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Cliente */}
      <Modal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        title="Dar de Alta Nuevo Cliente"
        subtitle="Agrega un punto de venta o cliente para las rutas de reparto"
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre del Comercio / Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Panadería San Martín"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Persona de Contacto
              </label>
              <input
                type="text"
                placeholder="Ej: Marcelo Gómez"
                value={newClientContact}
                onChange={(e) => setNewClientContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Teléfono / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+54 9 261 123-4567"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dirección de Entrega
            </label>
            <input
              type="text"
              placeholder="Ej: San Martín 1500, Mendoza"
              value={newClientAddress}
              onChange={(e) => setNewClientAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Repartidor Asignado
              </label>
              <select
                value={newClientDriverId}
                onChange={(e) => setNewClientDriverId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Lista de Precios
              </label>
              <select
                value={newClientPriceListId}
                onChange={(e) => setNewClientPriceListId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              >
                {priceLists.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Saldo Inicial Deudor ($) (si ya debe plata de antes)
            </label>
            <input
              type="number"
              value={newClientInitialDebt}
              onChange={(e) => setNewClientInitialDebt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddClientOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 shadow-sm"
            >
              Crear Cliente
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Registrar Cobro Directo */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title={`Registrar Cobranza a ${selectedClientForPayment?.name || 'Cliente'}`}
        subtitle={`Saldo actual adeudado: ${formatCurrency(selectedClientForPayment?.currentDebt || 0)}`}
      >
        <form onSubmit={handleRegisterPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Monto a Abonar ($) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder={selectedClientForPayment?.currentDebt?.toString() || '0'}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-base font-bold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Medio de Pago
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('efectivo')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'bg-slate-100 text-slate-950 border-slate-200 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                💵 Efectivo en Mano
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  paymentMethod === 'transferencia'
                    ? 'bg-slate-100 text-slate-950 border-slate-200 font-bold shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                📱 Transferencia Bancaria
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 shadow-sm"
            >
              Registrar Cobro
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Historial de Movimientos de Cuenta Corriente */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedClientForHistory(null);
        }}
        title={`Historial de Movimientos: ${clientHistoryData?.client?.name || 'Cliente'}`}
        subtitle={`ID: ${clientHistoryData?.client?.id || '-'} • Contacto: ${clientHistoryData?.client?.contact || '-'} • ${clientHistoryData?.client?.address || 'Sin dirección'}`}
        maxWidth="max-w-4xl"
      >
        {clientHistoryData && (
          <div className="space-y-6">
            {/* Header Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Saldo Deudor Actual
                </span>
                <span className={`text-xl font-bold font-mono block mt-0.5 ${
                  clientHistoryData.currentDebt > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {formatCurrency(clientHistoryData.currentDebt)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {clientHistoryData.currentDebt > 0 ? 'Con saldo pendiente' : 'Al día'}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Pedidos Hoy
                </span>
                <span className="text-xl font-bold text-white font-mono block mt-0.5">
                  {formatCurrency(clientHistoryData.totalBilled)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {clientHistoryData.orders.filter(o => o.totalAmount > 0).length} entregas
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Total Pagado Hoy
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono block mt-0.5">
                  {formatCurrency(clientHistoryData.totalPaid)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Cobrado en ruta o fábrica
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Saldo Previo
                </span>
                <span className="text-xl font-bold text-slate-300 font-mono block mt-0.5">
                  {formatCurrency(clientHistoryData.initialDebt)}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Deuda anterior
                </span>
              </div>
            </div>

            {/* Client Info Banner */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{clientHistoryData.client.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Repartidor: <strong className="text-white">{clientHistoryData.driver?.name || 'No asignado'}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lista: <strong className="text-white">{clientHistoryData.priceList?.name || 'Reparto'}</strong></span>
                </div>
              </div>

              <button
                onClick={() => sendStatementWhatsApp(clientHistoryData)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                title="Enviar estado de cuenta detallado por WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar Estado de Cuenta</span>
              </button>
            </div>

            {/* List of Movements */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Movimientos Registrados ({clientHistoryData.orders.length})</span>
                </h4>
                <span className="text-[11px] text-slate-500">Orden cronológico</span>
              </div>

              {clientHistoryData.orders.length === 0 && clientHistoryData.initialDebt === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/40 rounded-xl border border-slate-800">
                  No hay movimientos, pedidos ni pagos registrados para este cliente.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {/* Saldo Inicial / Anterior si tiene */}
                  {clientHistoryData.initialDebt > 0 && (
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Saldo Inicial / Anterior de Cuenta Corriente</div>
                          <div className="text-[11px] text-slate-400">Saldo pendiente acumulado previo a la jornada</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Saldo previo</span>
                        <span className="font-bold text-rose-400 font-mono text-sm">
                          +{formatCurrency(clientHistoryData.initialDebt)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Cada pedido / cobranza */}
                  {clientHistoryData.orders.map((order, idx) => {
                    const orderDriver = drivers.find((d) => d.id === order.driverId);
                    const whoCollected = orderDriver ? orderDriver.name : 'Administración / Fábrica';
                    const isPaymentOnly = order.totalAmount === 0 && order.paidAmount > 0;
                    const orderShortage = Math.max(0, (order.totalAmount || 0) - (order.paidAmount || 0));
                    const dateStr = formatDate(order.timestamp || order.date);
                    const timeStr = order.timestamp ? formatTime(order.timestamp) : '';

                    return (
                      <div
                        key={order.id || idx}
                        className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-all shadow-sm"
                      >
                        {/* Top Movement Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80 text-xs">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg ${
                              isPaymentOnly ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {isPaymentOnly ? <DollarSign className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className="font-bold text-white text-xs block">
                                {isPaymentOnly ? 'Cobranza Directa / Pago a Cuenta' : 'Entrega de Pedido en Ruta'}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono">
                                {dateStr} {timeStr && `• ${timeStr} hs`}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Quién le cobró */}
                            <div className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1.5">
                              <User className="w-3 h-3 text-slate-400" />
                              <span>Cobró: <strong className="text-white">{whoCollected}</strong></span>
                            </div>

                            <Badge variant={order.paymentMethod === 'efectivo' ? 'emerald' : 'neutral'} size="sm">
                              {order.paymentMethod === 'efectivo' ? '💵 Efectivo' : '📱 Transferencia'}
                            </Badge>
                          </div>
                        </div>

                        {/* Breakdown Metrics */}
                        <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono text-xs">
                          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-sans block">Total Pedido</span>
                            <span className="font-bold text-white text-sm">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>

                          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-sans block">Cobrado / Pagado</span>
                            <span className="font-bold text-emerald-400 text-sm">
                              {formatCurrency(order.paidAmount)}
                            </span>
                          </div>

                          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                            <span className="text-[10px] text-slate-400 font-sans block">Debe del Pedido</span>
                            <span className={`font-bold text-sm ${
                              orderShortage > 0 ? 'text-rose-400' : 'text-emerald-400'
                            }`}>
                              {orderShortage > 0 ? `+${formatCurrency(orderShortage)}` : 'Saldado ✓'}
                            </span>
                          </div>
                        </div>

                        {/* Items detail if any */}
                        {order.items && order.items.length > 0 && (
                          <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 space-y-1.5">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                              Mercadería Entregada ({order.items.length} productos):
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {order.items.map((item, i) => {
                                const prod = productsMap[item.productId];
                                return (
                                  <div key={i} className="flex items-center justify-between text-slate-300 py-0.5">
                                    <span className="flex items-center gap-1.5 truncate">
                                      <span>{prod?.icon || '🥖'}</span>
                                      <span className="text-white font-medium">{item.quantity} {prod?.unit || 'un.'} {prod?.name || item.productId}</span>
                                      {item.detailNotes && (
                                        <span className="text-[10px] text-slate-400 italic">({item.detailNotes})</span>
                                      )}
                                    </span>
                                    <span className="font-mono text-slate-400 shrink-0 ml-2">
                                      {formatCurrency(item.subtotal || (item.quantity * item.unitPrice))}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Order Notes */}
                        {order.notes && (
                          <div className="text-[11px] text-slate-400 bg-slate-950/30 px-2.5 py-1.5 rounded border border-slate-800/60">
                            <span className="font-semibold text-slate-300">Observaciones: </span>
                            <span>{order.notes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setIsHistoryModalOpen(false);
                  setSelectedClientForHistory(null);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    const client = clientHistoryData.client;
                    setIsHistoryModalOpen(false);
                    setSelectedClientForPayment(client);
                    setIsPaymentModalOpen(true);
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Registrar Cobro</span>
                </button>

                <button
                  type="button"
                  onClick={() => sendStatementWhatsApp(clientHistoryData)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Resumen</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
