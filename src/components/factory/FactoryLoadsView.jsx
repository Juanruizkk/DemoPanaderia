import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { PRODUCT_CATEGORIES } from '../../data/productCatalog';
import { Badge } from '../common/Badge';
import {
  Factory,
  Truck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export const FactoryLoadsView = () => {
  const { drivers, products, vanMovements, updateVanMovement } = useBakery();
  const [selectedDriverId, setSelectedDriverId] = useState('rep-2'); // Gustavo por defecto como en calle.jpg
  const [selectedDay, setSelectedDay] = useState('Viernes 28');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const selectedDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const driverMovs = vanMovements[selectedDriverId] || {};

  const daysOfWeek = ['Lunes 24', 'Martes 25', 'Miércoles 26', 'Jueves 27', 'Viernes 28', 'Sábado 29'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (productId, field, value) => {
    updateVanMovement(selectedDriverId, productId, field, value);
  };

  return (    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-slate-900/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center text-lg font-bold">
            🏭
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-heading">
                Planilla de Carga, Recarga y Descarga de Fábrica
              </h2>
              <Badge variant="neutral" size="sm">calle.jpg</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Control de salidas y retornos de mercadería física por camioneta para el cuadre automático diario.
            </p>
          </div>
        </div>

        {/* Driver selector */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {drivers.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriverId(d.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDriverId === d.id
                  ? 'bg-slate-100 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              selectedDay === day
                ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar producto a cargar o descargar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input text-xs rounded-xl px-3 py-2 text-slate-300"
          >
            <option value="all">Todas las Categorías</option>
            <option value={PRODUCT_CATEGORIES.DETALLE}>{PRODUCT_CATEGORIES.DETALLE}</option>
            <option value={PRODUCT_CATEGORIES.FRESCOS}>{PRODUCT_CATEGORIES.FRESCOS}</option>
          </select>
        </div>
      </div>

      {/* Carga/Descarga Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 uppercase font-semibold text-[11px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5 text-slate-300">Producto</th>
                <th className="px-3 py-3.5 text-slate-400">Categoría</th>
                <th className="px-3 py-3.5 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                    <span>Carga (Mañana)</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recarga (Fábrica)</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-center text-slate-300">
                  <div className="flex items-center justify-center gap-1">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-slate-400" />
                    <span>Descarga (Tarde)</span>
                  </div>
                </th>
                <th className="px-3 py-3.5 text-center text-slate-300">
                  <span>Cambios s/cargo</span>
                </th>
                <th className="px-4 py-3.5 text-right font-bold text-slate-200 bg-slate-850/60">
                  Vendido Físico
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {filteredProducts.map((product) => {
                const mov = driverMovs[product.id] || { carga: 0, recarga: 0, descarga: 0, cambios: 0 };
                const vendidoFisico = Math.max(0, (mov.carga || 0) + (mov.recarga || 0) - (mov.cambios || 0) - (mov.descarga || 0));

                return (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{product.icon}</span>
                        <div>
                          <div className="font-bold text-white text-xs">{product.name}</div>
                          <div className="text-[10px] text-slate-400">Unidad: {product.unit}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <Badge variant="neutral" size="sm">
                        {product.category === PRODUCT_CATEGORIES.FRESCOS ? 'Fresco' : 'Detalle'}
                      </Badge>
                    </td>

                    {/* Carga Inicial */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={mov.carga || ''}
                        placeholder="0"
                        onChange={(e) => handleInputChange(product.id, 'carga', e.target.value)}
                        className="w-16 text-center py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-slate-600 font-mono font-bold text-slate-200 text-xs"
                      />
                    </td>

                    {/* Recarga */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={mov.recarga || ''}
                        placeholder="0"
                        onChange={(e) => handleInputChange(product.id, 'recarga', e.target.value)}
                        className="w-16 text-center py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-slate-600 font-mono font-bold text-slate-200 text-xs"
                      />
                    </td>

                    {/* Descarga Final */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={mov.descarga || ''}
                        placeholder="0"
                        onChange={(e) => handleInputChange(product.id, 'descarga', e.target.value)}
                        className="w-16 text-center py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-slate-600 font-mono font-bold text-slate-200 text-xs"
                      />
                    </td>

                    {/* Cambios sin costo */}
                    <td className="px-2 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        value={mov.cambios || ''}
                        placeholder="0"
                        onChange={(e) => handleInputChange(product.id, 'cambios', e.target.value)}
                        className="w-16 text-center py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-slate-600 font-mono font-bold text-slate-200 text-xs"
                      />
                    </td>

                    {/* Vendido Físico Calculado */}
                    <td className="px-4 py-3 text-right font-mono font-bold text-sm text-white bg-slate-850/60">
                      {vendidoFisico}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
