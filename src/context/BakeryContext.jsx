import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_PRODUCTS, PRICE_LISTS } from '../data/productCatalog';
import { DRIVERS, INITIAL_CLIENTS, INITIAL_ORDERS, INITIAL_VAN_MOVEMENTS, INITIAL_EXPENSES } from '../data/initialData';
import { INITIAL_AUDIT_LOGS, INITIAL_PAST_CLOSURES } from '../data/mockAuditHistory';
import { calculateVanAuditForDriver, calculateCashSettlementForDriver, calculateCustomerBalances } from '../utils/calculations';

const BakeryContext = createContext();

const LOCAL_STORAGE_KEY = 'dipietro_bakery_system_v1';

export const BakeryProvider = ({ children }) => {
  // Estado de Navegación y Roles
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin', 'driver', 'factory', 'audit'
  const [activeDriverId, setActiveDriverId] = useState('rep-1'); // 'rep-1' (Ezequiel), 'rep-2' (Gustavo)
  const [selectedDate, setSelectedDate] = useState('2026-09-11');

  // Inicializar estado desde LocalStorage o datos base
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error cargando desde LocalStorage:', e);
    }
    return {
      products: INITIAL_PRODUCTS,
      priceLists: PRICE_LISTS,
      clients: INITIAL_CLIENTS,
      drivers: DRIVERS,
      orders: INITIAL_ORDERS,
      vanMovements: INITIAL_VAN_MOVEMENTS,
      expenses: INITIAL_EXPENSES,
      auditLogs: INITIAL_AUDIT_LOGS,
      pastClosures: INITIAL_PAST_CLOSURES,
    };
  });

  // Guardar automáticamente en LocalStorage al cambiar cualquier dato
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error guardando en LocalStorage:', e);
    }
  }, [data]);

  // Mapa rápido de productos por ID
  const productsMap = useMemo(() => {
    return data.products.reduce((acc, p) => {
      acc[p.id] = p;
      return acc;
    }, {});
  }, [data.products]);

  // Mapa de clientes por ID
  const clientsMap = useMemo(() => {
    return data.clients.reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
  }, [data.clients]);

  // Repartidor activo actual
  const activeDriver = useMemo(() => {
    return data.drivers.find(d => d.id === activeDriverId) || data.drivers[0];
  }, [data.drivers, activeDriverId]);

  // Función para registrar un log de auditoría
  const logAction = (type, category, description, details, severity = 'info') => {
    const userNames = {
      admin: 'Superadministradora (Dueña)',
      driver: activeDriver ? activeDriver.name : 'Repartidor',
      factory: 'Cadete Fábrica (Matías)',
      audit: 'Auditoría Sistema'
    };

    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      user: userNames[currentRole] || 'Usuario',
      role: currentRole,
      category, // 'stock', 'dinero', 'entrega', 'cambio', 'gasto'
      description,
      details,
      severity // 'info', 'success', 'warning', 'danger'
    };

    setData(prev => ({
      ...prev,
      auditLogs: [newLog, ...prev.auditLogs]
    }));
  };

  // 1. GESTIÓN DE PEDIDOS Y ENTREGAS
  const addOrder = (orderData) => {
    const orderId = `ord-${Date.now()}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      date: selectedDate,
      status: 'delivered',
      timestamp: new Date().toISOString(),
    };

    setData(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));

    const client = clientsMap[orderData.clientId];
    const clientName = client ? client.name : 'Cliente';
    logAction(
      'ENTREGA_PEDIDO',
      'entrega',
      `Entrega registrada para ${clientName}`,
      `Total: $${orderData.totalAmount} | Pagado: $${orderData.paidAmount} (${orderData.paymentMethod.toUpperCase()}) | Repartidor: ${activeDriver.name}`,
      'success'
    );

    return newOrder;
  };

  const updateOrder = (orderId, updatedFields) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => o.id === orderId ? { ...o, ...updatedFields } : o)
    }));

    logAction(
      'MODIFICACION_PEDIDO',
      'entrega',
      `Pedido modificado #${orderId}`,
      `Se actualizaron valores del pedido por ${activeDriver.name}`,
      'warning'
    );
  };

  const deleteOrder = (orderId) => {
    setData(prev => ({
      ...prev,
      orders: prev.orders.filter(o => o.id !== orderId)
    }));

    logAction(
      'ELIMINACION_PEDIDO',
      'entrega',
      `Pedido eliminado #${orderId}`,
      `El pedido fue retirado del sistema por el usuario`,
      'danger'
    );
  };

  // 2. GESTIÓN DE CARGA Y CAMIONETA (CALLE.JPG)
  const updateVanMovement = (driverId, productId, field, value) => {
    const numValue = Math.max(0, Number(value) || 0);
    const prod = productsMap[productId];
    const prodName = prod ? prod.name : productId;
    const driver = data.drivers.find(d => d.id === driverId);
    const driverName = driver ? driver.name : driverId;

    setData(prev => {
      const driverMovs = { ...(prev.vanMovements[driverId] || {}) };
      const currentProductMov = { ...(driverMovs[productId] || { carga: 0, recarga: 0, descarga: 0, cambios: 0 }) };
      
      currentProductMov[field] = numValue;
      driverMovs[productId] = currentProductMov;

      return {
        ...prev,
        vanMovements: {
          ...prev.vanMovements,
          [driverId]: driverMovs
        }
      };
    });

    const fieldNames = {
      carga: 'Carga inicial',
      recarga: 'Recarga en fábrica',
      descarga: 'Descarga final',
      cambios: 'Cambios sin costo'
    };

    logAction(
      'MOVIMIENTO_CAMIONETA',
      'stock',
      `${fieldNames[field]} de ${prodName} (${driverName})`,
      `Valor actualizado a ${numValue} ${prod ? prod.unit : 'unidades'}`,
      field === 'cambios' ? 'warning' : 'info'
    );
  };

  // 3. GESTIÓN DE GASTOS
  const addExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      driverId: activeDriverId,
      timestamp: new Date().toISOString()
    };

    setData(prev => ({
      ...prev,
      expenses: [newExpense, ...prev.expenses]
    }));

    logAction(
      'GASTO_REGISTRADO',
      'gasto',
      `Gasto de ${expenseData.category}: $${expenseData.amount}`,
      `${expenseData.description} (Repartidor: ${activeDriver.name})`,
      'warning'
    );
  };

  const deleteExpense = (expenseId) => {
    setData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== expenseId)
    }));

    logAction(
      'GASTO_ELIMINADO',
      'gasto',
      `Gasto cancelado #${expenseId}`,
      `Eliminado por ${activeDriver.name}`,
      'info'
    );
  };

  // 4. GESTIÓN DE CLIENTES
  const addClient = (clientData) => {
    const newClient = {
      ...clientData,
      id: `cli-${Date.now()}`,
      initialDebt: Number(clientData.initialDebt) || 0
    };

    setData(prev => ({
      ...prev,
      clients: [...prev.clients, newClient]
    }));

    logAction(
      'NUEVO_CLIENTE',
      'entrega',
      `Nuevo cliente registrado: ${clientData.name}`,
      `Asignado a ${data.drivers.find(d => d.id === clientData.driverId)?.name || 'Repartidor'}`,
      'info'
    );
  };

  const updateClient = (clientId, updatedFields) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === clientId ? { ...c, ...updatedFields } : c)
    }));
  };

  // 5. GESTIÓN DE PRECIOS
  const updateProductPrice = (productId, listId, newPrice) => {
    const numPrice = Number(newPrice);
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            prices: {
              ...p.prices,
              [listId]: numPrice
            },
            basePrice: listId === 'reparto' ? numPrice : p.basePrice
          };
        }
        return p;
      })
    }));

    const prod = productsMap[productId];
    logAction(
      'CAMBIO_PRECIO',
      'dinero',
      `Actualización de precio: ${prod?.name}`,
      `Lista ${listId}: $${numPrice}`,
      'warning'
    );
  };

  // 6. CIERRE DIARIO Y RENDICIÓN
  const closeDailyShift = (driverId, cashHandedIn, notes = '') => {
    const driver = data.drivers.find(d => d.id === driverId) || activeDriver;
    const vanAudit = calculateVanAuditForDriver(driverId, data.products, data.vanMovements, data.orders);
    const cashSettlement = calculateCashSettlementForDriver(driverId, data.orders, data.expenses);
    
    const cashDifference = Number(cashHandedIn) - cashSettlement.netCashDueToBakery;
    const status = (cashDifference === 0 && vanAudit.totalFaltantesUnidades === 0) ? 'cuadrado' : 'con_faltante';

    const newClosure = {
      id: `close-${selectedDate}-${driverId}-${Date.now()}`,
      date: selectedDate,
      driverId,
      driverName: driver.name,
      totalBilled: cashSettlement.totalBilled,
      cashCollected: cashSettlement.totalCashCollected,
      transferCollected: cashSettlement.totalTransferCollected,
      creditGiven: cashSettlement.creditGenerated,
      expensesAmount: cashSettlement.totalExpenses,
      cashDueToBakery: cashSettlement.netCashDueToBakery,
      cashHandedIn: Number(cashHandedIn),
      cashDifference,
      stockDifferencesCount: vanAudit.totalFaltantesUnidades,
      status,
      summary: notes || (status === 'cuadrado' 
        ? 'Jornada cerrada sin desvíos de caja ni de mercadería.' 
        : `Atención: Diferencia de caja de $${cashDifference} y ${vanAudit.totalFaltantesUnidades} unidades de stock faltantes.`)
    };

    setData(prev => ({
      ...prev,
      pastClosures: [newClosure, ...prev.pastClosures]
    }));

    logAction(
      'CIERRE_JORNADA',
      'dinero',
      `Cierre diario completado: ${driver.name}`,
      `Efectivo entregado: $${cashHandedIn} (Diferencia: $${cashDifference}) | Estado: ${status.toUpperCase()}`,
      status === 'cuadrado' ? 'success' : 'danger'
    );

    return newClosure;
  };

  // 7. RESTABLECER DATOS DE DEMO
  const resetAllDataToInitial = () => {
    const freshData = {
      products: INITIAL_PRODUCTS,
      priceLists: PRICE_LISTS,
      clients: INITIAL_CLIENTS,
      drivers: DRIVERS,
      orders: INITIAL_ORDERS,
      vanMovements: INITIAL_VAN_MOVEMENTS,
      expenses: INITIAL_EXPENSES,
      auditLogs: INITIAL_AUDIT_LOGS,
      pastClosures: INITIAL_PAST_CLOSURES,
    };
    setData(freshData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    logAction('RESET_DEMO', 'dinero', 'Datos de prueba reiniciados', 'Valores restaurados según imágenes originales', 'info');
  };

  // CÁLCULOS REACTIVOS CONSOLIDADOS
  // Auditoría del repartidor activo
  const activeVanAudit = useMemo(() => {
    return calculateVanAuditForDriver(activeDriverId, data.products, data.vanMovements, data.orders);
  }, [activeDriverId, data.products, data.vanMovements, data.orders]);

  // Rendición de caja del repartidor activo
  const activeCashSettlement = useMemo(() => {
    return calculateCashSettlementForDriver(activeDriverId, data.orders, data.expenses);
  }, [activeDriverId, data.orders, data.expenses]);

  // Cuentas corrientes consolidadas
  const customerBalances = useMemo(() => {
    return calculateCustomerBalances(data.clients, data.orders);
  }, [data.clients, data.orders]);

  // Consolidado global de la panadería (todos los repartidores)
  const companySummary = useMemo(() => {
    let totalBilled = 0;
    let totalCash = 0;
    let totalTransfer = 0;
    let totalExpenses = 0;
    let totalStockLossValue = 0;
    let totalStockMissingUnits = 0;

    data.drivers.forEach(driver => {
      const settlement = calculateCashSettlementForDriver(driver.id, data.orders, data.expenses);
      const audit = calculateVanAuditForDriver(driver.id, data.products, data.vanMovements, data.orders);
      
      totalBilled += settlement.totalBilled;
      totalCash += settlement.totalCashCollected;
      totalTransfer += settlement.totalTransferCollected;
      totalExpenses += settlement.totalExpenses;
      totalStockLossValue += audit.totalPerdidaMonetaria;
      totalStockMissingUnits += audit.totalFaltantesUnidades;
    });

    const totalStreetDebt = customerBalances.reduce((acc, c) => acc + c.currentDebt, 0);

    return {
      totalBilled,
      totalCash,
      totalTransfer,
      totalExpenses,
      netCashTotal: Math.max(0, totalCash - totalExpenses),
      totalStockLossValue,
      totalStockMissingUnits,
      totalStreetDebt,
      totalDeliveredOrders: data.orders.filter(o => o.status === 'delivered').length
    };
  }, [data.drivers, data.orders, data.expenses, data.products, data.vanMovements, customerBalances]);

  const value = {
    // Roles y navegación
    currentRole,
    setCurrentRole,
    activeDriverId,
    setActiveDriverId,
    activeDriver,
    selectedDate,
    setSelectedDate,
    
    // Datos crudos
    products: data.products,
    priceLists: data.priceLists,
    clients: data.clients,
    drivers: data.drivers,
    orders: data.orders,
    vanMovements: data.vanMovements,
    expenses: data.expenses,
    auditLogs: data.auditLogs,
    pastClosures: data.pastClosures,

    // Mapas
    productsMap,
    clientsMap,

    // Acciones
    addOrder,
    updateOrder,
    deleteOrder,
    updateVanMovement,
    addExpense,
    deleteExpense,
    addClient,
    updateClient,
    updateProductPrice,
    closeDailyShift,
    addAuditLog: logAction,
    resetAllDataToInitial,

    // Métricas calculadas
    activeVanAudit,
    activeCashSettlement,
    customerBalances,
    companySummary
  };

  return (
    <BakeryContext.Provider value={value}>
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery debe usarse dentro de un BakeryProvider');
  }
  return context;
};
