import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatTime, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  History,
  Search,
  Filter,
  Package,
  DollarSign,
  Truck,
  Fuel,
  RefreshCw,
  AlertTriangle,
  User,
  Clock
} from 'lucide-react';

export const AuditTimeline = () => {
  const { auditLogs } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos los Eventos' },
    { id: 'stock', label: 'Stock & Cargas' },
    { id: 'dinero', label: 'Dinero & Precios' },
    { id: 'entrega', label: 'Entregas a Clientes' },
    { id: 'gasto', label: 'Gastos & Combustible' },
  ];

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getLogIcon = (category, severity) => {
    if (severity === 'danger') return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    if (category === 'stock') return <Package className="w-4 h-4 text-slate-300" />;
    if (category === 'dinero') return <DollarSign className="w-4 h-4 text-slate-300" />;
    if (category === 'entrega') return <Truck className="w-4 h-4 text-slate-300" />;
    if (category === 'gasto') return <Fuel className="w-4 h-4 text-slate-300" />;
    return <History className="w-4 h-4 text-slate-400" />;
  };

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case 'success':
        return 'emerald';
      case 'warning':
        return 'amber';
      case 'danger':
        return 'rose';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por descripción, usuario, producto o comprobante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
                categoryFilter === cat.id
                  ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No se encontraron registros de auditoría para los filtros aplicados.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const logDate = formatDate(log.timestamp);
              const logTime = formatTime(log.timestamp);

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center text-[10px] shadow-sm group-hover:border-slate-400 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-slate-300" />
                  </div>

                  {/* Card Content */}
                  <div className="glass-card rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-800">
                          {getLogIcon(log.category, log.severity)}
                        </div>
                        <span className="text-xs font-bold text-white font-heading">
                          {log.description}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant={getSeverityBadgeVariant(log.severity)} size="sm">
                          {log.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{logTime}</span>
                        </div>
                      </div>
                    </div>

                    {log.details && (
                      <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
                        {log.details}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">{log.user}</span>
                      </div>
                      <span className="font-mono">{logDate}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
