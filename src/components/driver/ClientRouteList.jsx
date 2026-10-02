import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency } from '../../utils/formatters';
import { generateWhatsAppReceipt } from '../../utils/exportHelper';
import { OrderModal } from './OrderModal';
import { Badge } from '../common/Badge';
import {
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  MessageCircle,
  Plus,
  Search,
  Receipt,
  AlertTriangle,
  ChevronRight,
  UserPlus,
  X
} from 'lucide-react';
import { PRICE_LISTS } from '../../data/productCatalog';

const EMPTY_NEW_CLIENT = { name: '', contact: '', phone: '', address: '', priceListId: 'reparto', initialDebt: '' };

export const ClientRouteList = () => {
  const { clients, orders, activeDriverId, activeDriver, productsMap, addClient } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientForOrder, setSelectedClientForOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [routeTab, setRouteTab] = useState('todos'); // 'todos' | 'pendientes' | 'entregados' | 'saldo'
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState(EMPTY_NEW_CLIENT);
  const [newClientError, setNewClientError] = useState('');

  // Filtrar clientes asignados al repartidor activo
  const driverClients = clients.filter((c) => c.driverId === activeDriverId);

  const getClientOrderToday = (clientId) => {
    return orders.find((o) => o.clientId === clientId && o.driverId === activeDriverId && o.status === 'delivered');
  };

  const getClientCurrentDebt = (client) => {
    const order = getClientOrderToday(client.id);
    const prevDebt = Number(client.initialDebt || 0);
    if (!order) return prevDebt;
    return Math.max(0, prevDebt + order.totalAmount - order.paidAmount);
  };

  const tabFilteredClients = driverClients.filter((client) => {
    const order = getClientOrderToday(client.id);
    if (routeTab === 'entregados') return !!order;
    if (routeTab === 'pendientes') return !order;
    if (routeTab === 'saldo') return getClientCurrentDebt(client) > 0;
    return true;
  });

  const filteredClients = tabFilteredClients.filter((client) => {
    return (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenOrder = (client) => {
    const existing = getClientOrderToday(client.id);
    setEditingOrder(existing || null);
    setSelectedClientForOrder(client);
  };

  const handleSendWhatsApp = (e, client, order) => {
    e.stopPropagation();
    if (!order) return;
    const initialDebt = Number(client.initialDebt || 0);
    const totalDebt = Math.max(0, initialDebt + order.totalAmount - order.paidAmount);
    const encoded = generateWhatsAppReceipt(client, order, productsMap, totalDebt);
    window.open(`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
  };

  const deliveredCount = driverClients.filter((c) => !!getClientOrderToday(c.id)).length;
  const progressPercent = driverClients.length > 0 ? Math.round((deliveredCount / driverClients.length) * 100) : 0;

  const handleNewClientChange = (field, value) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
    setNewClientError('');
  };

  const handleSaveNewClient = () => {
    if (!newClient.name.trim()) {
      setNewClientError('El nombre del comercio es obligatorio.');
      return;
    }
    addClient({ ...newClient, driverId: activeDriverId });
    setNewClient(EMPTY_NEW_CLIENT);
    setShowNewClient(false);
    setNewClientError('');
  };

  return (
    <div className="space-y-5">
      {/* New Client Modal */}
      {showNewClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-slate-300" />
                <h3 className="text-base font-bold text-white">Nuevo Cliente</h3>
              </div>
              <button onClick={() => { setShowNewClient(false); setNewClientError(''); setNewClient(EMPTY_NEW_CLIENT); }} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre del comercio *</label>
                <input
                  type="text"
                  placeholder="Ej: Almacén Pérez"
                  value={newClient.name}
                  onChange={e => handleNewClientChange('name', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contacto</label>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newClient.contact}
                    onChange={e => handleNewClientChange('contact', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="+54 9 261..."
                    value={newClient.phone}
                    onChange={e => handleNewClientChange('phone', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Dirección</label>
                <input
                  type="text"
                  placeholder="Calle y número"
                  value={newClient.address}
                  onChange={e => handleNewClientChange('address', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Lista de precios</label>
                  <select
                    value={newClient.priceListId}
                    onChange={e => handleNewClientChange('priceListId', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                  >
                    {PRICE_LISTS.map(pl => (
                      <option key={pl.id} value={pl.id}>{pl.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Saldo inicial ($)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newClient.initialDebt}
                    onChange={e => handleNewClientChange('initialDebt', e.target.value)}
                    onWheel={e => e.target.blur()}
                    className="w-full px-3 py-2.5 rounded-xl glass-input text-sm text-white"
                  />
                </div>
              </div>
              {newClientError && (
                <p className="text-xs text-rose-400 font-semibold">{newClientError}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowNewClient(false); setNewClientError(''); setNewClient(EMPTY_NEW_CLIENT); }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewClient}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 transition-colors shadow-sm"
              >
                Agregar Cliente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Route Progress Header */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">
              Progreso de Ruta de Reparto
            </span>
            <div className="text-xl font-bold text-white font-heading mt-0.5">
              {deliveredCount} de {driverClients.length} Clientes Atendidos ({progressPercent}%)
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-slate-300 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Route Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'todos', label: 'Todos', count: driverClients.length },
          { id: 'pendientes', label: 'Pendientes', count: driverClients.filter(c => !getClientOrderToday(c.id)).length },
          { id: 'entregados', label: 'Entregados', count: deliveredCount },
          { id: 'saldo', label: 'Con Saldo', count: driverClients.filter(c => getClientCurrentDebt(c) > 0).length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setRouteTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              routeTab === tab.id
                ? 'bg-slate-100 text-slate-950 border-slate-200 font-bold shadow-sm'
                : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              routeTab === tab.id ? 'bg-slate-300 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search Input & Add Client */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar parada o comercio por nombre o calle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <button
          onClick={() => setShowNewClient(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-white text-slate-950 transition-all shadow-sm shrink-0"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Client Route Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredClients.length === 0 ? (
          <div className="col-span-2 glass-panel p-8 text-center text-slate-500 rounded-2xl text-xs">
            No se encontraron clientes en tu hoja de ruta.
          </div>
        ) : (
          filteredClients.map((client) => {
            const order = getClientOrderToday(client.id);
            const isDelivered = !!order;
            const hasPrevDebt = Number(client.initialDebt || 0) > 0;

            return (
              <div
                key={client.id}
                onClick={() => handleOpenOrder(client)}
                className={`glass-card glass-card-hover rounded-2xl p-4 border cursor-pointer relative overflow-hidden transition-all ${
                  isDelivered
                    ? 'border-slate-700 bg-slate-900/60'
                    : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/30'
                }`}
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isDelivered ? 'bg-emerald-500/80' : 'bg-slate-700'
                  }`}
                />

                <div className="flex items-start justify-between gap-2 pl-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm font-heading">{client.name}</h4>
                      {isDelivered ? (
                        <Badge variant="emerald" size="sm">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Entregado</span>
                        </Badge>
                      ) : (
                        <Badge variant="neutral" size="sm">
                          <Clock className="w-3 h-3" />
                          <span>Pendiente</span>
                        </Badge>
                      )}
                    </div>

                    {client.address && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </div>
                    )}

                    {hasPrevDebt && (
                      <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium pt-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                        <span>Saldo anterior: {formatCurrency(client.initialDebt)}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-300 shrink-0 mt-1" />
                </div>

                {/* Bottom Delivery Info if Delivered */}
                {isDelivered && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 pl-2 flex items-center justify-between text-xs">
                    <div className="font-mono">
                      <span className="text-slate-400 text-[10px] block">Total Pedido</span>
                      <span className="font-bold text-white text-sm">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>

                    <div className="font-mono text-right">
                      <span className="text-slate-400 text-[10px] block">Cobrado</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {formatCurrency(order.paidAmount)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleSendWhatsApp(e, client, order)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                      title="Reenviar comprobante por WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Delivery Modal */}
      <OrderModal
        isOpen={!!selectedClientForOrder}
        onClose={() => {
          setSelectedClientForOrder(null);
          setEditingOrder(null);
        }}
        client={selectedClientForOrder}
        existingOrder={editingOrder}
      />
    </div>
  );
};
