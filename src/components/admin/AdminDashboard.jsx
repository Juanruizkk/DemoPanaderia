import React, { useState } from 'react';
import { useBakery } from '../../context/BakeryContext';
import { MetricCard } from '../common/MetricCard';
import { StockAuditTable } from './StockAuditTable';
import { CashReconciliation } from './CashReconciliation';
import { CustomerDebts } from './CustomerDebts';
import { PriceListManager } from './PriceListManager';
import { formatCurrency } from '../../utils/formatters';
import {
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Tag,
  Receipt,
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export const AdminDashboard = () => {
  const { companySummary, customerBalances } = useBakery();
  const [activeTab, setActiveTab] = useState('stock-audit'); // 'stock-audit', 'cash-rec', 'clients', 'prices'

  const tabs = [
    { id: 'stock-audit', label: 'Auditoría de Camioneta (Anti-Robo)', icon: ShieldAlert, alert: companySummary.totalStockMissingUnits > 0 },
    { id: 'cash-rec', label: 'Rendición de Caja & Gastos', icon: DollarSign },
    { id: 'clients', label: 'Cuentas Corrientes & Saldos', icon: Users, alert: companySummary.totalStreetDebt > 0 },
    { id: 'prices', label: 'Catálogo & Listas de Precios', icon: Tag },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & KPI Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-heading">
            Centro de Control & Auditoría Gerencial
          </h1>
          <p className="text-xs text-slate-400">
            Monitoreo en tiempo real de salidas de fábrica, ventas en calle, cobranzas y prevención de pérdidas.
          </p>
        </div>
      </div>

      {/* 4 Big KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Ventas Totales Hoy"
          value={formatCurrency(companySummary.totalBilled)}
          subtitle={`${companySummary.totalDeliveredOrders} entregas registradas en calle`}
          icon={Receipt}
          variant="amber"
        />

        <MetricCard
          title="Efectivo a Rendir en Caja"
          value={formatCurrency(companySummary.netCashTotal)}
          subtitle={`Cobrado efectivo menos ${formatCurrency(companySummary.totalExpenses)} en gastos`}
          icon={DollarSign}
          variant="emerald"
        />

        <MetricCard
          title="Cobrado Transferencias"
          value={formatCurrency(companySummary.totalTransfer)}
          subtitle="Acreditaciones bancarias directas"
          icon={CreditCard}
          variant="sky"
        />

        <MetricCard
          title={companySummary.totalStockMissingUnits > 0 ? "Alerta: Faltante de Mercadería" : "Control de Mercadería"}
          value={companySummary.totalStockMissingUnits > 0 ? `${companySummary.totalStockMissingUnits} un.` : "Sin Desvíos"}
          subtitle={companySummary.totalStockMissingUnits > 0 ? `Riesgo: ${formatCurrency(companySummary.totalStockLossValue)}` : "100% de productos justificados"}
          icon={companySummary.totalStockMissingUnits > 0 ? AlertTriangle : ShieldCheck}
          variant={companySummary.totalStockMissingUnits > 0 ? "rose" : "emerald"}
          onClick={() => setActiveTab('stock-audit')}
        />
      </div>

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-slate-100 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="pt-2">
        {activeTab === 'stock-audit' && <StockAuditTable />}
        {activeTab === 'cash-rec' && <CashReconciliation />}
        {activeTab === 'clients' && <CustomerDebts />}
        {activeTab === 'prices' && <PriceListManager />}
      </div>
    </div>
  );
};
