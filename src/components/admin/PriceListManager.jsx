import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { PRODUCT_CATEGORIES } from '../../data/productCatalog';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { Tag, Edit3, Check, Search, Filter } from 'lucide-react';

export const PriceListManager = () => {
  const { products, priceLists, updateProductPrice } = useBakery();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingCell, setEditingCell] = useState(null); // { productId, listId }
  const [tempPrice, setTempPrice] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (productId, listId, currentPrice) => {
    setEditingCell({ productId, listId });
    setTempPrice(currentPrice.toString());
  };

  const handleSaveEdit = (productId, listId) => {
    if (tempPrice && !isNaN(tempPrice)) {
      updateProductPrice(productId, listId, Number(tempPrice));
    }
    setEditingCell(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-heading">
            Gestión de Precios & Listas Diferenciadas
          </h3>
          <p className="text-xs text-slate-400">
            Lista DiPietro al 01/08 con precios configurables para Reparto en Calle, Despacho Mostrador y Supermercados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {priceLists.map((list) => (
            <Badge key={list.id} variant="neutral" size="md">
              {list.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar producto por nombre o código..."
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
            className="glass-input text-xs rounded-xl px-3 py-2"
          >
            <option value="all">Todas las Categorías</option>
            <option value={PRODUCT_CATEGORIES.FRESCOS}>{PRODUCT_CATEGORIES.FRESCOS}</option>
            <option value={PRODUCT_CATEGORIES.DETALLE}>{PRODUCT_CATEGORIES.DETALLE}</option>
          </select>
        </div>
      </div>

      {/* Price Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800 tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Producto</th>
                <th className="px-3 py-3.5">Categoría</th>
                <th className="px-3 py-3.5">Unidad</th>
                {priceLists.map((list) => (
                  <th key={list.id} className="px-4 py-3.5 text-right">
                    {list.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{product.icon}</span>
                      <div>
                        <div className="font-bold text-white">{product.name}</div>
                        <div className="text-[10px] text-slate-400">Código: {product.shortCode}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <Badge variant="neutral" size="sm">
                      {product.category === PRODUCT_CATEGORIES.FRESCOS ? 'Fresco' : 'Detalle'}
                    </Badge>
                  </td>

                  <td className="px-3 py-3 text-slate-400 capitalize">{product.unit}</td>

                  {priceLists.map((list) => {
                    const price = product.prices?.[list.id] || product.basePrice;
                    const isEditing =
                      editingCell?.productId === product.id && editingCell?.listId === list.id;

                    return (
                      <td key={list.id} className="px-4 py-3 text-right font-mono">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              autoFocus
                              value={tempPrice}
                              onChange={(e) => setTempPrice(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(product.id, list.id);
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              className="w-24 px-2 py-1 text-right text-xs rounded-lg glass-input text-white font-bold font-mono"
                            />
                            <button
                              onClick={() => handleSaveEdit(product.id, list.id)}
                              className="p-1 rounded bg-slate-700 text-white hover:bg-slate-600"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(product.id, list.id, price)}
                            className="group inline-flex items-center gap-1.5 font-bold hover:text-white px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                            title="Haz clic para modificar precio"
                          >
                            <span className="text-slate-100">{formatCurrency(price)}</span>
                            <Edit3 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
