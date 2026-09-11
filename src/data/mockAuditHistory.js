export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-09-11T07:15:00',
    type: 'CARGA_CAMIONETA',
    user: 'Cadete Fábrica (Matías)',
    role: 'factory',
    category: 'stock',
    description: 'Carga inicial matutina completada para Repartidor 1 (Ezequiel)',
    details: '35 Pan Francés, 5 Pan de Miga, 400 Tortillas, 50 Facturas, 3 Bizcochitos Grasa cargados en Kangoo AB 123 CD.',
    severity: 'info'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-11T07:30:00',
    type: 'CARGA_CAMIONETA',
    user: 'Cadete Fábrica (Matías)',
    role: 'factory',
    category: 'stock',
    description: 'Carga inicial matutina completada para Repartidor 2 (Gustavo)',
    details: '72 Hamburguesas, 56 Vienas, 25 Lactal Neg, 15 Lactal Blanco, 16 Prepizzas, 7 Pizetas, 4 Mantecados.',
    severity: 'info'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-11T07:45:00',
    type: 'GASTO_REGISTRADO',
    user: 'Ezequiel (Rep 1)',
    role: 'driver',
    category: 'dinero',
    description: 'Registro de gasto en combustible ($15.000)',
    details: 'Carga Nafta Súper YPF. Comprobante Ticket #4491 cargado.',
    severity: 'warning'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-11T08:30:00',
    type: 'ENTREGA_PEDIDO',
    user: 'Ezequiel (Rep 1)',
    role: 'driver',
    category: 'entrega',
    description: 'Entrega completada a Naty Pan & Más',
    details: '4 Pan Francés ($7.200), 30 Tortillas ($4.500), 6 Facturas ($1.890). Cobrado: $13.590 en efectivo.',
    severity: 'success'
  },
  {
    id: 'log-5',
    timestamp: '2026-09-11T08:50:00',
    type: 'COBRANZA_DEUDA',
    user: 'Ezequiel (Rep 1)',
    role: 'driver',
    category: 'dinero',
    description: 'Entrega y pago parcial en Vero Despacho',
    details: 'Venta $4.500 + Saldo previo $4.500 = $9.000. Cliente pagó $4.000 en efectivo. Saldo pendiente actual: $5.000.',
    severity: 'warning'
  },
  {
    id: 'log-6',
    timestamp: '2026-09-11T09:10:00',
    type: 'COBRO_TRANSFERENCIA',
    user: 'Ezequiel (Rep 1)',
    role: 'driver',
    category: 'dinero',
    description: 'Pago por transferencia en Mary Almacén',
    details: 'Cobrado $4.500 mediante transferencia Mercado Pago. Acreditación confirmada.',
    severity: 'info'
  },
  {
    id: 'log-7',
    timestamp: '2026-09-11T10:05:00',
    type: 'ENTREGA_MAYORISTA',
    user: 'Ezequiel (Rep 1)',
    role: 'driver',
    category: 'entrega',
    description: 'Gran entrega a Timbó Minimarket',
    details: '17 Pan Francés, 3 Pan Miga, 200 Tortillas, 20 Facturas. Total venta: $72.300. Cobrado efectivo: $70.000. Deuda generada: $2.300.',
    severity: 'success'
  },
  {
    id: 'log-8',
    timestamp: '2026-09-11T10:15:00',
    type: 'CAMBIO_PRODUCTO',
    user: 'Gustavo (Rep 2)',
    role: 'driver',
    category: 'stock',
    description: 'Cambio de 3 paquetes de Viena sin costo',
    details: 'Se retiraron 3 paquetes de Viena en mal estado reportados por cliente. Justificado en planilla de descarga.',
    severity: 'warning'
  }
];

export const INITIAL_PAST_CLOSURES = [
  {
    id: 'close-2026-09-10',
    date: '2026-09-10',
    driverId: 'rep-1',
    driverName: 'Ezequiel (Rep 1)',
    totalBilled: 145800,
    cashCollected: 128000,
    transferCollected: 14000,
    creditGiven: 3800,
    expensesAmount: 18000,
    cashDueToBakery: 110000,
    cashHandedIn: 110000,
    cashDifference: 0,
    stockDifferencesCount: 0,
    status: 'cuadrado', // cuadrado, con_faltante, pendiente
    summary: 'Jornada cerrada sin desvíos. Efectivo $110.000 entregado en tesorería de fábrica.'
  },
  {
    id: 'close-2026-09-10-gustavo',
    date: '2026-09-10',
    driverId: 'rep-2',
    driverName: 'Gustavo (Rep 2)',
    totalBilled: 182400,
    cashCollected: 155000,
    transferCollected: 25000,
    creditGiven: 2400,
    expensesAmount: 6000,
    cashDueToBakery: 149000,
    cashHandedIn: 145000,
    cashDifference: -4000,
    stockDifferencesCount: 1,
    status: 'con_faltante',
    summary: 'Alerta: Faltante de $4.000 en rendición de efectivo y 1 bolsa de Palmeritas sin registrar entrega.'
  },
  {
    id: 'close-2026-09-09',
    date: '2026-09-09',
    driverId: 'rep-1',
    driverName: 'Ezequiel (Rep 1)',
    totalBilled: 139200,
    cashCollected: 115000,
    transferCollected: 20000,
    creditGiven: 4200,
    expensesAmount: 12000,
    cashDueToBakery: 103000,
    cashHandedIn: 103000,
    cashDifference: 0,
    stockDifferencesCount: 0,
    status: 'cuadrado',
    summary: 'Jornada cerrada correctamente.'
  },
  {
    id: 'close-2026-09-08',
    date: '2026-09-08',
    driverId: 'rep-1',
    driverName: 'Ezequiel (Rep 1)',
    totalBilled: 152000,
    cashCollected: 130000,
    transferCollected: 15000,
    creditGiven: 7000,
    expensesAmount: 16500,
    cashDueToBakery: 113500,
    cashHandedIn: 113500,
    cashDifference: 0,
    stockDifferencesCount: 0,
    status: 'cuadrado',
    summary: 'Jornada cerrada correctamente.'
  }
];
