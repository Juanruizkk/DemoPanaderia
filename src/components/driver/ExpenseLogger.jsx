import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { Fuel, Plus, Trash2, Receipt, AlertCircle } from 'lucide-react';

export const ExpenseLogger = () => {
  const { expenses, activeDriverId, activeDriver, addExpense, deleteExpense } = useBakery();

  const [category, setCategory] = useState('combustible');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidWithCash, setPaidWithCash] = useState(true);

  const driverExpenses = expenses.filter((e) => e.driverId === activeDriverId);
  const totalDriverExpenses = driverExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !description.trim()) return;

    addExpense({
      category,
      amount: Number(amount),
      description,
      paidWithCash
    });

    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading">
            Registro de Gastos de Ruta ({activeDriver.name})
          </h3>
          <p className="text-xs text-slate-400">
            Anota tus compras de combustible, peajes o viáticos autorizados. Se descontarán automáticamente de tu rendición de efectivo al cerrar la jornada.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-500 uppercase font-bold block">
            Total Gastos Declarados
          </span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">
            {formatCurrency(totalDriverExpenses)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-4 font-heading flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Cargar Nuevo Comprobante</span>
          </h4>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tipo de Gasto
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="combustible">⛽ Combustible / Nafta / GNC</option>
                <option value="viaticos">🥪 Viáticos / Refrigerio</option>
                <option value="peaje">🛣️ Peajes / Estacionamiento</option>
                <option value="mantenimiento">🔧 Reparación / Taller</option>
                <option value="otro">📦 Otro gasto de ruta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monto Gastado ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Ej: 15000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl glass-input text-sm font-bold font-mono text-amber-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detalle / N° Comprobante *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Carga YPF Ticket #4491"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="cashPaid"
                checked={paidWithCash}
                onChange={(e) => setPaidWithCash(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-800"
              />
              <label htmlFor="cashPaid" className="text-xs text-slate-300 cursor-pointer">
                Pagado con el efectivo de las cobranzas
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Gasto</span>
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white font-heading">
            Gastos Registrados Hoy
          </h4>

          {driverExpenses.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No tienes gastos cargados en esta jornada.
            </div>
          ) : (
            <div className="space-y-3">
              {driverExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="glass-card rounded-xl p-3.5 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Fuel className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{exp.description}</div>
                      <div className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                        <span className="capitalize">{exp.category}</span>
                        <span>•</span>
                        <span>{formatTime(exp.timestamp)}</span>
                        {exp.paidWithCash && (
                          <span className="text-emerald-400 font-semibold">(Efectivo de ruta)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-amber-300 font-mono">
                      {formatCurrency(exp.amount)}
                    </span>
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
