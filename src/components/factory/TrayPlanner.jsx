import React from 'react';
import { useBakery } from '../../context/BakeryContext';
import { PRODUCT_CATEGORIES } from '../../data/productCatalog';
import { Badge } from '../common/Badge';
import { Layers, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TrayPlanner = () => {
  const { products, vanMovements, drivers } = useBakery();

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="glass-panel rounded-2xl p-5 border border-purple-500/20 bg-gradient-to-r from-purple-950/20 to-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Planificador de Relleno de Bandejas & Producción</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Calcula exactamente cuántas unidades hornear y rellenar en las viandas/bandejas para mañana, restando el sobrante devuelto en la descarga de hoy para no armarlas "a ojo".
          </p>
        </div>

        <Badge variant="indigo" size="lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Optimización de Sobrantes</span>
        </Badge>
      </div>

      {/* Grid of Drivers Tray Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {drivers.map((driver) => {
          const driverMovs = vanMovements[driver.id] || {};

          return (
            <div key={driver.id} className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-base font-heading">{driver.name}</h4>
                  <span className="text-xs text-slate-400">{driver.vehicle}</span>
                </div>
                <Badge variant="amber" size="sm">Para Mañana</Badge>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1 text-xs">
                {products.map((product) => {
                  const mov = driverMovs[product.id] || { carga: 0, descarga: 0 };
                  const targetLoad = mov.carga || 0;
                  const leftoverInFactory = mov.descarga || 0;
                  const neededToBake = Math.max(0, targetLoad - leftoverInFactory);

                  if (targetLoad === 0 && leftoverInFactory === 0) return null;

                  return (
                    <div
                      key={product.id}
                      className="glass-card rounded-xl p-3 border border-slate-800/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{product.icon}</span>
                        <div>
                          <div className="font-bold text-white">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Meta Carga: {targetLoad} {product.unit} | Sobrante en bandeja: {leftoverInFactory}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-purple-400 uppercase font-bold block">
                          Completar en Bandeja
                        </span>
                        <span className="text-base font-black text-white font-mono">
                          +{neededToBake} {product.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
