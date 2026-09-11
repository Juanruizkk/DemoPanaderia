import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency } from '../../utils/formatters';
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
  Truck
} from 'lucide-react';

export const CustomerDebts = () => {
  const { customerBalances, drivers, priceLists, addClient, addOrder } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [driverFilter, setDriverFilter] = useState('all');
  const [debtOnlyFilter, setDebtOnlyFilter] = useState(false);

  // Modales
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedClientForPayment, setSelectedClientForPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');

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

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-rose-500/30 bg-rose-950/15 glow-rose">
          <div className="flex items-center justify-between text-rose-400 mb-1">
            <span className="text-xs font-semibold uppercase">Deuda Total en Calle (Fiado)</span>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">
            {formatCurrency(totalStreetDebt)}
          </div>
          <div className="text-xs text-rose-300/80 mt-1">
            {totalDebtorClients} clientes con saldo pendiente de pago
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase">Clientes Registrados</span>
            <Users className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white font-heading">
            {customerBalances.length} clientes
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Distribuidos en {drivers.length} rutas de reparto
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase">Gestión de Cobranzas</span>
            <div className="text-sm font-medium text-slate-300 mt-1">
              Envía avisos de saldo por WhatsApp con un solo clic.
            </div>
          </div>
          <button
            onClick={() => setIsAddClientOpen(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 shrink-0"
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
                        <div className="font-bold text-white text-sm">{client.name}</div>
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
                        <div className="flex items-center justify-center gap-2">
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
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
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'efectivo'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
              >
                💵 Efectivo en Mano
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('transferencia')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'transferencia'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
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
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
            >
              Registrar Cobro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
