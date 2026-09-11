// Catálogo maestro extraído de la lista de precios DiPietro al 01/08
export const PRODUCT_CATEGORIES = {
  FRESCOS: 'Panadería & Frescos',
  DETALLE: 'Detalle & Envasados',
};

export const PRICE_LISTS = [
  { id: 'reparto', name: 'Reparto Calle (Estándar)', multiplier: 1.0, isDefault: true },
  { id: 'despacho', name: 'Despacho Fábrica', multiplier: 0.9, isDefault: false },
  { id: 'supermercado', name: 'Supermercados / Mayorista', multiplier: 0.85, isDefault: false },
];

export const INITIAL_PRODUCTS = [
  // FRESCOS
  {
    id: 'pan-frances',
    name: 'Pan Francés',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'bolsa',
    basePrice: 1800,
    shortCode: 'Fra',
    prices: { reparto: 1800, despacho: 1650, supermercado: 1550 },
    icon: '🥖'
  },
  {
    id: 'pan-x2',
    name: 'Pan Francés x2',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'bolsa',
    basePrice: 1800,
    shortCode: 'x2',
    prices: { reparto: 1800, despacho: 1650, supermercado: 1550 },
    icon: '🥖'
  },
  {
    id: 'pan-x3',
    name: 'Pan Francés x3',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'bolsa',
    basePrice: 1800,
    shortCode: 'x3',
    prices: { reparto: 1800, despacho: 1650, supermercado: 1550 },
    icon: '🥖'
  },
  {
    id: 'pan-miga',
    name: 'Pan de Miga',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'kg',
    basePrice: 1800,
    shortCode: 'Mig',
    prices: { reparto: 1800, despacho: 1650, supermercado: 1550 },
    icon: '🍞'
  },
  {
    id: 'pan-negro',
    name: 'Pan Negro / Salvado',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'bolsa',
    basePrice: 1900,
    shortCode: 'Neg',
    prices: { reparto: 1900, despacho: 1750, supermercado: 1650 },
    icon: '🍞'
  },
  {
    id: 'tortillas-horno',
    name: 'Tortillas (Horno)',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'unidad',
    basePrice: 150,
    shortCode: 'Tor Hor',
    prices: { reparto: 150, despacho: 135, supermercado: 125 },
    icon: '🫓'
  },
  {
    id: 'tortillas-crudas',
    name: 'Tortillas (Crudas)',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'unidad',
    basePrice: 150,
    shortCode: 'Tor Cru',
    prices: { reparto: 150, despacho: 135, supermercado: 125 },
    icon: '🫓'
  },
  {
    id: 'facturas',
    name: 'Facturas Surtidas / Especiales',
    category: PRODUCT_CATEGORIES.FRESCOS,
    unit: 'unidad',
    basePrice: 315,
    shortCode: 'Fact',
    prices: { reparto: 315, despacho: 290, supermercado: 270 },
    icon: '🥐'
  },

  // DETALLE Y ENVASADOS
  {
    id: 'bizcochito-grasa',
    name: 'Bizcochito Grasa (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 5800,
    shortCode: 'Biz Grasa',
    prices: { reparto: 5800, despacho: 5300, supermercado: 5000 },
    icon: '🍪'
  },
  {
    id: 'bizcocho-negro',
    name: 'Bizcocho Negro (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 5000,
    shortCode: 'Biz Negro',
    prices: { reparto: 5000, despacho: 4600, supermercado: 4300 },
    icon: '🍪'
  },
  {
    id: 'doble-salvado',
    name: 'Doble Salvado (x6u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 1900,
    shortCode: 'Doble Salv',
    prices: { reparto: 1900, despacho: 1750, supermercado: 1600 },
    icon: '🍞'
  },
  {
    id: 'grisines',
    name: 'Grisines (1/2kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'bolsa',
    basePrice: 3500,
    shortCode: 'Grisin 1/2',
    prices: { reparto: 3500, despacho: 3200, supermercado: 3000 },
    icon: '🥖'
  },
  {
    id: 'grisines-chia',
    name: 'Grisines c/s chia (1/2kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'bolsa',
    basePrice: 3500,
    shortCode: 'Grisin Chia',
    prices: { reparto: 3500, despacho: 3200, supermercado: 3000 },
    icon: '🥖'
  },
  {
    id: 'hamburguesa',
    name: 'Pan Hamburguesa (4u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 1000,
    shortCode: 'Hamb 4u',
    prices: { reparto: 1000, despacho: 900, supermercado: 850 },
    icon: '🍔'
  },
  {
    id: 'lactal-blanco',
    name: 'Lactal Blanco',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 2200,
    shortCode: 'Lactal Bco',
    prices: { reparto: 2200, despacho: 2000, supermercado: 1900 },
    icon: '🍞'
  },
  {
    id: 'lactal-neg-semillado',
    name: 'Lactal Neg Semillado',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 2200,
    shortCode: 'Lactal Neg',
    prices: { reparto: 2200, despacho: 2000, supermercado: 1900 },
    icon: '🍞'
  },
  {
    id: 'maicena',
    name: 'Alfajor Maicena (u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'unidad',
    basePrice: 800,
    shortCode: 'Maicena',
    prices: { reparto: 800, despacho: 750, supermercado: 700 },
    icon: '🧁'
  },
  {
    id: 'mantecados',
    name: 'Mantecados (x20u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 5000,
    shortCode: 'Mantec 20u',
    prices: { reparto: 5000, despacho: 4600, supermercado: 4300 },
    icon: '🧁'
  },
  {
    id: 'muffin',
    name: 'Muffin (u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'unidad',
    basePrice: 1300,
    shortCode: 'Muffin',
    prices: { reparto: 1300, despacho: 1200, supermercado: 1100 },
    icon: '🧁'
  },
  {
    id: 'palmeritas',
    name: 'Palmeritas (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 7800,
    shortCode: 'Palmerita',
    prices: { reparto: 7800, despacho: 7200, supermercado: 6800 },
    icon: '🥨'
  },
  {
    id: 'pepa-membrillo',
    name: 'Pepa Membrillo / Choc (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 6300,
    shortCode: 'Pepa',
    prices: { reparto: 6300, despacho: 5800, supermercado: 5400 },
    icon: '🍪'
  },
  {
    id: 'galleta-pepitos',
    name: 'Galleta Pepitos (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 6300,
    shortCode: 'Pepitos',
    prices: { reparto: 6300, despacho: 5800, supermercado: 5400 },
    icon: '🍪'
  },
  {
    id: 'pizeta',
    name: 'Pizeta (x20u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 2000,
    shortCode: 'Pizeta 20u',
    prices: { reparto: 2000, despacho: 1850, supermercado: 1750 },
    icon: '🍕'
  },
  {
    id: 'prepizza',
    name: 'Prepizza (x2u / x3u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 2000,
    shortCode: 'Prepizza',
    prices: { reparto: 2000, despacho: 1850, supermercado: 1750 },
    icon: '🍕'
  },
  {
    id: 'rayado',
    name: 'Pan Rayado (xkg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 1900,
    shortCode: 'Rayado',
    prices: { reparto: 1900, despacho: 1750, supermercado: 1600 },
    icon: '🥖'
  },
  {
    id: 'semolada',
    name: 'Semolada (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 6000,
    shortCode: 'Semolada',
    prices: { reparto: 6000, despacho: 5500, supermercado: 5200 },
    icon: '🍞'
  },
  {
    id: 'semolada-chia',
    name: 'Semolada c/s chia (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 6000,
    shortCode: 'Semol Chia',
    prices: { reparto: 6000, despacho: 5500, supermercado: 5200 },
    icon: '🍞'
  },
  {
    id: 'tostada',
    name: 'Tostada (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 6500,
    shortCode: 'Tostada',
    prices: { reparto: 6500, despacho: 6000, supermercado: 5600 },
    icon: '🍞'
  },
  {
    id: 'vainilla',
    name: 'Vainilla (u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'unidad',
    basePrice: 500,
    shortCode: 'Vainilla',
    prices: { reparto: 500, despacho: 450, supermercado: 400 },
    icon: '🧁'
  },
  {
    id: 'viena',
    name: 'Viena (6u)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'paquete',
    basePrice: 1000,
    shortCode: 'Viena 6u',
    prices: { reparto: 1000, despacho: 900, supermercado: 850 },
    icon: '🌭'
  },
  {
    id: 'chip',
    name: 'Chip / Chipá (kg)',
    category: PRODUCT_CATEGORIES.DETALLE,
    unit: 'kg',
    basePrice: 3800,
    shortCode: 'Chip',
    prices: { reparto: 3800, despacho: 3500, supermercado: 3200 },
    icon: '🧀'
  }
];
