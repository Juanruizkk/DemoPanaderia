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
  ChevronRight
} from 'lucide-react';

export const ClientRouteList = () => {
  const { clients, orders, activeDriverId, activeDriver, productsMap } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientForOrder, setSelectedClientForOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  // Filtrar clientes asignados al repartidor activo
  const driverClients = clients.filter((c) => c.driverId === activeDriverId);

  const filteredClients = driverClients.filter((client) => {
    return (
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getClientOrderToday = (clientId) => {
    return orders.find((o) => o.clientId === clientId && o.driverId === activeDriverId && o.status === 'delivered');
  };

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

  return (
    <div className="space-y-5">
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
          <Badge variant={progressPercent === 100 ? 'emerald' : 'amber'} size="lg">
            {progressPercent === 100 ? 'Ruta Completada' : 'En Recorrido'}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar parada o comercio por nombre o calle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs"
        />
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
                    ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-950/15 to-slate-900/40'
                    : 'border-slate-800/80 hover:border-amber-500/40'
                }`}
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    isDelivered ? 'bg-emerald-500' : 'bg-slate-700'
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
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Saldo anterior pendiente: {formatCurrency(client.initialDebt)}</span>
                      </div>
                    )}
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 shrink-0 mt-1" />
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
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-colors"
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
