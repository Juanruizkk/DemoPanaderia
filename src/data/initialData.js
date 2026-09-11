export const DRIVERS = [
  { id: 'rep-1', name: 'Ezequiel (Rep 1)', vehicle: 'Renault Kangoo - AB 123 CD', phone: '+54 9 261 456-7890', color: '#f59e0b' },
  { id: 'rep-2', name: 'Gustavo (Rep 2)', vehicle: 'Peugeot Partner - AE 987 FG', phone: '+54 9 261 654-3210', color: '#3b82f6' },
];

export const INITIAL_CLIENTS = [
  { id: 'cli-1', name: 'Tito Despensa', contact: 'Tito', phone: '+54 9 261 111-2233', address: 'Av. San Martín 1420', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-2', name: 'Supermercado Central', contact: 'Gerencia', phone: '+54 9 261 222-3344', address: 'Calle Mitre 890', priceListId: 'supermercado', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-3', name: 'Sauce Almacén', contact: 'Daniel', phone: '+54 9 261 333-4455', address: 'B° El Sauce M:B C:12', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-4', name: 'Marisa Minimarket', contact: 'Marisa', phone: '+54 9 261 444-5566', address: 'Ruta Panamericana Km 14', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-5', name: 'Melina Kiosco', contact: 'Melina', phone: '+54 9 261 555-6677', address: 'Paso de los Andes 450', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-6', name: 'Naty Pan & Más', contact: 'Natalia', phone: '+54 9 261 666-7788', address: 'Lavalle 320', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-7', name: 'Vero Despacho', contact: 'Verónica', phone: '+54 9 261 777-8899', address: 'Belgrano 1105', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 4500 },
  { id: 'cli-8', name: 'Mary Almacén', contact: 'María', phone: '+54 9 261 888-9900', address: 'Suipacha 780', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-9', name: 'Joaquín Comidas', contact: 'Joaquín', phone: '+54 9 261 999-0011', address: 'Colón 560', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-10', name: 'Carmen Rotisería', contact: 'Carmen', phone: '+54 9 261 101-1122', address: 'Godoy Cruz 900', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-11', name: 'Karina Autoservicio', contact: 'Karina', phone: '+54 9 261 121-3141', address: 'Olascoaga 230', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-12', name: 'Timbó Minimarket', contact: 'Hernán', phone: '+54 9 261 141-5161', address: 'Las Cañas 1890', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 12000 },
  { id: 'cli-13', name: 'José Despensa', contact: 'José', phone: '+54 9 261 161-7181', address: 'Bandera de los Andes 340', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-14', name: 'Dante Kiosco', contact: 'Dante', phone: '+54 9 261 181-9202', address: 'Sarmiento 670', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-15', name: 'Faty Panadería', contact: 'Fátima', phone: '+54 9 261 202-1222', address: 'Chile 1450', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 2500 },
  { id: 'cli-16', name: 'Lucía Almacén', contact: 'Lucía', phone: '+54 9 261 222-3242', address: 'Necochea 310', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-17', name: 'Vivi2 Despensa', contact: 'Viviana', phone: '+54 9 261 242-5262', address: 'España 890', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-18', name: 'Esther Almacén', contact: 'Esther', phone: '+54 9 261 262-7282', address: 'Montevideo 540', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-19', name: 'Carina Kiosco', contact: 'Carina', phone: '+54 9 261 282-9303', address: 'Rivadavia 120', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  { id: 'cli-20', name: 'Delfina Express', contact: 'Delfina', phone: '+54 9 261 303-1323', address: '9 de Julio 980', priceListId: 'reparto', driverId: 'rep-1', initialDebt: 0 },
  
  // Clientes asignados a Gustavo (Rep 2)
  { id: 'cli-21', name: 'Panificadora Sur', contact: 'Marcelo', phone: '+54 9 261 323-3343', address: 'Costanera 2100', priceListId: 'reparto', driverId: 'rep-2', initialDebt: 5000 },
  { id: 'cli-22', name: 'Don Bosco Minimarket', contact: 'Raúl', phone: '+54 9 261 343-5363', address: 'Don Bosco 430', priceListId: 'reparto', driverId: 'rep-2', initialDebt: 0 },
  { id: 'cli-23', name: 'La Esquina Bar', contact: 'Esteban', phone: '+54 9 261 363-7383', address: 'Arístides 500', priceListId: 'reparto', driverId: 'rep-2', initialDebt: 1800 },
];

// Pedidos reales cargados para hoy (basados en pedidosrepartidores.jpg)
export const INITIAL_ORDERS = [
  {
    id: 'ord-1',
    driverId: 'rep-1',
    clientId: 'cli-6', // Naty
    date: '2026-09-11',
    status: 'delivered', // pending, delivered
    items: [
      { productId: 'pan-frances', quantity: 4, unitPrice: 1800, subtotal: 7200 },
      { productId: 'tortillas-horno', quantity: 30, unitPrice: 150, subtotal: 4500, detailNotes: '15 crem - 15 f' },
      { productId: 'facturas', quantity: 6, unitPrice: 315, subtotal: 1890, detailNotes: 'surtidas' },
    ],
    totalAmount: 13590,
    paidAmount: 13590,
    paymentMethod: 'efectivo', // efectivo, transferencia, mixto, none
    notes: 'Pagó el total en efectivo',
    timestamp: '2026-09-11T08:30:00'
  },
  {
    id: 'ord-2',
    driverId: 'rep-1',
    clientId: 'cli-7', // Vero (Saldo anterior 4500)
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'tortillas-horno', quantity: 30, unitPrice: 150, subtotal: 4500, detailNotes: '10f - 10g - 10cr' },
    ],
    totalAmount: 4500,
    paidAmount: 4000,
    paymentMethod: 'efectivo',
    notes: 'Pagó $4.000 a cuenta de su saldo',
    timestamp: '2026-09-11T08:50:00'
  },
  {
    id: 'ord-3',
    driverId: 'rep-1',
    clientId: 'cli-8', // Mary
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'tortillas-horno', quantity: 30, unitPrice: 150, subtotal: 4500, detailNotes: '15crem - 15f' },
    ],
    totalAmount: 4500,
    paidAmount: 4500,
    paymentMethod: 'transferencia',
    notes: 'Pagó con transferencia Mercado Pago',
    timestamp: '2026-09-11T09:10:00'
  },
  {
    id: 'ord-4',
    driverId: 'rep-1',
    clientId: 'cli-10', // Carmen
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'pan-frances', quantity: 4, unitPrice: 1800, subtotal: 7200 },
      { productId: 'tortillas-horno', quantity: 40, unitPrice: 150, subtotal: 6000, detailNotes: '20f - 20g' },
    ],
    totalAmount: 13200,
    paidAmount: 10000,
    paymentMethod: 'efectivo',
    notes: 'Quedó debiendo $3.200',
    timestamp: '2026-09-11T09:35:00'
  },
  {
    id: 'ord-5',
    driverId: 'rep-1',
    clientId: 'cli-12', // Timbo
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'pan-frances', quantity: 17, unitPrice: 1800, subtotal: 30600 },
      { productId: 'pan-miga', quantity: 3, unitPrice: 1800, subtotal: 5400 },
      { productId: 'tortillas-horno', quantity: 200, unitPrice: 150, subtotal: 30000, detailNotes: '130f - 40crem' },
      { productId: 'facturas', quantity: 20, unitPrice: 315, subtotal: 6300, detailNotes: '10dulc - 10cr' },
    ],
    totalAmount: 72300,
    paidAmount: 70000,
    paymentMethod: 'efectivo',
    notes: 'Pagó $70.000 en efectivo',
    timestamp: '2026-09-11T10:05:00'
  },
  {
    id: 'ord-6',
    driverId: 'rep-1',
    clientId: 'cli-15', // Faty
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'pan-frances', quantity: 5, unitPrice: 1800, subtotal: 9000 },
      { productId: 'tortillas-horno', quantity: 50, unitPrice: 150, subtotal: 7500, detailNotes: '20f - 10g - 5b' },
      { productId: 'facturas', quantity: 10, unitPrice: 315, subtotal: 3150, detailNotes: '15c - 5 surt' },
    ],
    totalAmount: 19650,
    paidAmount: 19650,
    paymentMethod: 'efectivo',
    notes: 'Pagó el total en efectivo',
    timestamp: '2026-09-11T10:30:00'
  },
  {
    id: 'ord-7',
    driverId: 'rep-1',
    clientId: 'cli-3', // Sauce
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'facturas', quantity: 8, unitPrice: 315, subtotal: 2520, detailNotes: '4c - 4d' },
    ],
    totalAmount: 2520,
    paidAmount: 2520,
    paymentMethod: 'efectivo',
    notes: '',
    timestamp: '2026-09-11T10:45:00'
  },
  {
    id: 'ord-8',
    driverId: 'rep-1',
    clientId: 'cli-5', // Melina
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'tortillas-horno', quantity: 40, unitPrice: 150, subtotal: 6000, detailNotes: '20f - 20g' },
    ],
    totalAmount: 6000,
    paidAmount: 5000,
    paymentMethod: 'efectivo',
    notes: 'Debe $1.000',
    timestamp: '2026-09-11T11:00:00'
  },

  // Pedidos de Gustavo (Rep 2)
  {
    id: 'ord-9',
    driverId: 'rep-2',
    clientId: 'cli-21', // Panificadora Sur
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'hamburguesa', quantity: 12, unitPrice: 1000, subtotal: 12000 },
      { productId: 'viena', quantity: 12, unitPrice: 1000, subtotal: 12000 },
      { productId: 'lactal-blanco', quantity: 7, unitPrice: 2200, subtotal: 15400 },
      { productId: 'lactal-neg-semillado', quantity: 13, unitPrice: 2200, subtotal: 28600 },
    ],
    totalAmount: 68000,
    paidAmount: 60000,
    paymentMethod: 'efectivo',
    notes: 'Quedan $8.000 a cuenta',
    timestamp: '2026-09-11T09:15:00'
  },
  {
    id: 'ord-10',
    driverId: 'rep-2',
    clientId: 'cli-22', // Don Bosco
    date: '2026-09-11',
    status: 'delivered',
    items: [
      { productId: 'bizcochito-grasa', quantity: 1, unitPrice: 5800, subtotal: 5800 },
      { productId: 'palmeritas', quantity: 2, unitPrice: 7800, subtotal: 15600 },
      { productId: 'prepizza', quantity: 4, unitPrice: 2000, subtotal: 8000 },
      { productId: 'pizeta', quantity: 2, unitPrice: 2000, subtotal: 4000 },
    ],
    totalAmount: 33400,
    paidAmount: 33400,
    paymentMethod: 'transferencia',
    notes: 'Transferencia directa a cuenta panadería',
    timestamp: '2026-09-11T10:15:00'
  }
];

// Cargas y movimientos de camioneta para hoy (basados en calle.jpg)
// Formato: { [driverId]: { [productId]: { carga: number, recarga: number, descarga: number, cambios: number } } }
export const INITIAL_VAN_MOVEMENTS = {
  'rep-1': {
    'pan-frances': { carga: 35, recarga: 0, descarga: 5, cambios: 0 },
    'pan-miga': { carga: 5, recarga: 0, descarga: 2, cambios: 0 },
    'pan-negro': { carga: 3, recarga: 0, descarga: 3, cambios: 0 },
    'tortillas-horno': { carga: 400, recarga: 0, descarga: 10, cambios: 0 },
    'facturas': { carga: 50, recarga: 0, descarga: 6, cambios: 0 },
    'bizcochito-grasa': { carga: 3, recarga: 0, descarga: 3, cambios: 0 },
    'lactal-blanco': { carga: 5, recarga: 0, descarga: 5, cambios: 0 },
    'hamburguesa': { carga: 10, recarga: 0, descarga: 10, cambios: 0 },
    'viena': { carga: 10, recarga: 0, descarga: 10, cambios: 0 }
  },
  'rep-2': {
    // Gustavo según calle.jpg Lunes/Martes
    'bizcochito-grasa': { carga: 3, recarga: 0, descarga: 2, cambios: 0 },
    'bizcocho-negro': { carga: 3, recarga: 0, descarga: 3, cambios: 0 },
    'doble-salvado': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'grisines': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'grisines-chia': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'hamburguesa': { carga: 72, recarga: 0, descarga: 59, cambios: 1 },
    'lactal-blanco': { carga: 15, recarga: 0, descarga: 8, cambios: 0 },
    'lactal-neg-semillado': { carga: 25, recarga: 0, descarga: 12, cambios: 0 },
    'mantecados': { carga: 4, recarga: 2, descarga: 6, cambios: 0 }, // Carga 4 + Recarga 2 - Descarga 6 = 0 vendidos
    'palmeritas': { carga: 4, recarga: 1, descarga: 2, cambios: 1 }, // 4 + 1 - 1 - 2 = 2 vendidos
    'pepa-membrillo': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'galleta-pepitos': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'pizeta': { carga: 7, recarga: 0, descarga: 4, cambios: 1 },
    'prepizza': { carga: 16, recarga: 0, descarga: 11, cambios: 1 },
    'rayado': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'semolada': { carga: 4, recarga: 0, descarga: 4, cambios: 0 },
    'semolada-chia': { carga: 0, recarga: 0, descarga: 0, cambios: 0 },
    'tostada': { carga: 0, recarga: 1, descarga: 1, cambios: 0 },
    'viena': { carga: 56, recarga: 0, descarga: 41, cambios: 3 }
  }
};

// Gastos registrados del día
export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    driverId: 'rep-1',
    category: 'combustible',
    amount: 15000,
    description: 'Carga Nafta Súper YPF (Comprobante #4491)',
    paidWithCash: true,
    timestamp: '2026-09-11T07:45:00'
  },
  {
    id: 'exp-2',
    driverId: 'rep-2',
    category: 'viaticos',
    amount: 3500,
    description: 'Agua mineral y peaje lateral acceso este',
    paidWithCash: true,
    timestamp: '2026-09-11T10:10:00'
  }
];
