import React from 'react';
import { BakeryProvider, useBakery } from './context/BakeryContext';
import { Header } from './components/common/Header';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DriverView } from './components/driver/DriverView';
import { FactoryDashboard } from './components/factory/FactoryDashboard';
import { AuditDashboard } from './components/audit/AuditDashboard';

const MainLayout = () => {
  const { currentRole } = useBakery();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentRole === 'admin' && <AdminDashboard />}
        {currentRole === 'driver' && <DriverView />}
        {currentRole === 'factory' && <FactoryDashboard />}
        {currentRole === 'audit' && <AuditDashboard />}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 font-bold">🥖 Panadería DiPietro</span>
            <span>•</span>
            <span>Sistema Integral de Gestión & Auditoría Antirrobo</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Demo Activa • Datos sincronizados con planillas calle.jpg y pedidosrepartidores.jpg
          </div>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <BakeryProvider>
      <MainLayout />
    </BakeryProvider>
  );
}

export default App;
