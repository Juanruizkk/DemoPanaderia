// Fórmulas matemáticas de auditoría y control de stock y dinero

export const calculateVanAuditForDriver = (driverId, products, vanMovements, orders) => {
  const driverMovements = vanMovements[driverId] || {};
  const driverOrders = orders.filter(o => o.driverId === driverId && o.status === 'delivered');

  // Sumar ventas por producto
  const deliveredMap = {};
  driverOrders.forEach(order => {
    order.items.forEach(item => {
      deliveredMap[item.productId] = (deliveredMap[item.productId] || 0) + Number(item.quantity || 0);
    });
  });

  const auditRows = products.map(product => {
    const mov = driverMovements[product.id] || { carga: 0, recarga: 0, descarga: 0, cambios: 0 };
    const carga = Number(mov.carga || 0);
    const recarga = Number(mov.recarga || 0);
    const descarga = Number(mov.descarga || 0);
    const cambios = Number(mov.cambios || 0);
    
    // Mercadería total disponible que salió de fábrica
    const totalSalida = carga + recarga - cambios;
    
    // Teórico vendido según planilla física de camioneta (calle.jpg)
    // Carga + Recarga - Cambios - Descarga = Vendido Teórico
    const teoricoVendido = Math.max(0, totalSalida - descarga);
    
    // Entregas reales registradas a clientes por el repartidor
    const entregadoRegistrado = deliveredMap[product.id] || 0;
    
    // Diferencia: Si da negativo -> faltante (salió de la camioneta pero no se anotó venta a cliente)
    // Si da positivo -> sobrante (anotó más ventas de las que bajaron físicamente)
    const diferencia = entregadoRegistrado - teoricoVendido;
    
    // Stock en camioneta restante en tiempo real (antes de la descarga final)
    const stockActualEnCamioneta = Math.max(0, totalSalida - entregadoRegistrado);

    // Valor monetario de la diferencia (para cuantificar robo o pérdida)
    const valorPerdida = diferencia < 0 ? Math.abs(diferencia) * product.basePrice : 0;

    return {
      product,
      carga,
      recarga,
      descarga,
      cambios,
      totalSalida,
      teoricoVendido,
      entregadoRegistrado,
      diferencia,
      stockActualEnCamioneta,
      valorPerdida,
      hasMovement: carga > 0 || recarga > 0 || descarga > 0 || cambios > 0 || entregadoRegistrado > 0
    };
  });

  // Filtrar productos con movimiento o mostrar todos si se desea
  const activeRows = auditRows.filter(r => r.hasMovement);

  // Totales
  const totalFaltantesUnidades = activeRows
    .filter(r => r.diferencia < 0)
    .reduce((acc, r) => acc + Math.abs(r.diferencia), 0);

  const totalSobrantesUnidades = activeRows
    .filter(r => r.diferencia > 0)
    .reduce((acc, r) => acc + r.diferencia, 0);

  const totalPerdidaMonetaria = activeRows.reduce((acc, r) => acc + r.valorPerdida, 0);

  return {
    rows: activeRows,
    allRows: auditRows,
    totalFaltantesUnidades,
    totalSobrantesUnidades,
    totalPerdidaMonetaria,
    isClean: totalFaltantesUnidades === 0 && totalSobrantesUnidades === 0
  };
};

export const calculateCashSettlementForDriver = (driverId, orders, expenses) => {
  const driverOrders = orders.filter(o => o.driverId === driverId && o.status === 'delivered');
  const driverExpenses = expenses.filter(e => e.driverId === driverId);

  let totalBilled = 0;
  let totalCashCollected = 0;
  let totalTransferCollected = 0;

  driverOrders.forEach(order => {
    totalBilled += Number(order.totalAmount || 0);
    const paid = Number(order.paidAmount || 0);
    
    if (order.paymentMethod === 'efectivo') {
      totalCashCollected += paid;
    } else if (order.paymentMethod === 'transferencia') {
      totalTransferCollected += paid;
    } else if (order.paymentMethod === 'mixto') {
      // Por defecto mitad y mitad o todo efectivo si no está discriminado
      totalCashCollected += paid;
    }
  });

  const totalCollected = totalCashCollected + totalTransferCollected;
  const creditGenerated = Math.max(0, totalBilled - totalCollected);

  // Gastos
  const totalExpenses = driverExpenses.reduce((acc, exp) => acc + Number(exp.amount || 0), 0);
  const cashExpenses = driverExpenses
    .filter(exp => exp.paidWithCash)
    .reduce((acc, exp) => acc + Number(exp.amount || 0), 0);

  // Efectivo neto que el repartidor DEBE entregar en la caja de la fábrica
  const netCashDueToBakery = Math.max(0, totalCashCollected - cashExpenses);

  return {
    totalBilled,
    totalCashCollected,
    totalTransferCollected,
    totalCollected,
    creditGenerated,
    totalExpenses,
    cashExpenses,
    netCashDueToBakery,
    ordersCount: driverOrders.length,
    expensesList: driverExpenses
  };
};

export const calculateCustomerBalances = (clients, orders, driverId = null) => {
  return clients
    .filter(client => !driverId || client.driverId === driverId)
    .map(client => {
      const clientOrders = orders.filter(o => o.clientId === client.id && o.status === 'delivered');
      
      const totalBilled = clientOrders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
      const totalPaid = clientOrders.reduce((acc, o) => acc + Number(o.paidAmount || 0), 0);
      
      const initialDebt = Number(client.initialDebt || 0);
      const currentDebt = initialDebt + totalBilled - totalPaid;
      
      return {
        ...client,
        totalBilled,
        totalPaid,
        currentDebt,
        ordersCount: clientOrders.length,
        hasDebt: currentDebt > 0
      };
    });
};
