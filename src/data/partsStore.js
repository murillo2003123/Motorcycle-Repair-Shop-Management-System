/**
 * Data Layer — Spare Parts Inventory Store
 * Owner: Keanu Dagala (Scribe & Builder)
 */

const INITIAL_PARTS = [
  {
    id: 1,
    name: 'Synthetic Scooter Oil 10W-40',
    sku: 'OIL-10W40',
    qty: 25,
    unitPrice: 320,
    category: 'lubricants',
  },
  {
    id: 2,
    name: 'Ceramic Front Brake Pads NMAX',
    sku: 'BRK-NMAXF',
    qty: 12,
    unitPrice: 550,
    category: 'brakes',
  },
  {
    id: 3,
    name: 'CVT Kevlar Drive Belt Click 125i',
    sku: 'ENG-CVT125',
    qty: 18,
    unitPrice: 890,
    category: 'engine',
  },
  {
    id: 4,
    name: 'NGK Laser Iridium Spark Plug CPR8EA',
    sku: 'ELC-NGK09',
    qty: 35,
    unitPrice: 480,
    category: 'electrical',
  },
  {
    id: 5,
    name: 'Michelin City Grip 2 Tubeless Tire 110/70-13',
    sku: 'TIR-MCG13',
    qty: 10,
    unitPrice: 2450,
    category: 'tires',
  },
  {
    id: 6,
    name: 'Yuasa Maintenance-Free Battery YTZ6V 12V',
    sku: 'ELC-YUA6V',
    qty: 14,
    unitPrice: 1380,
    category: 'electrical',
  },
  {
    id: 7,
    name: 'Motul Scooter Gear Oil 80W-90 120ml',
    sku: 'OIL-GEAR80',
    qty: 42,
    unitPrice: 150,
    category: 'lubricants',
  },
  {
    id: 8,
    name: 'Brembo DOT 4 Brake Fluid 500ml',
    sku: 'BRK-DOT4',
    qty: 20,
    unitPrice: 380,
    category: 'brakes',
  },
  {
    id: 9,
    name: 'Genuine High-Flow Air Filter Element Aerox/NMAX',
    sku: 'ENG-AIR155',
    qty: 22,
    unitPrice: 340,
    category: 'engine',
  },
  {
    id: 10,
    name: 'Heavy Duty Gold Drive Chain & Sprocket Set 428H',
    sku: 'ENG-CHN428',
    qty: 9,
    unitPrice: 1650,
    category: 'engine',
  },
  {
    id: 11,
    name: 'CNC Stealth Side Mirror Set & Handle Grip Accessories',
    sku: 'BDY-MIR01',
    qty: 15,
    unitPrice: 750,
    category: 'body',
  },
  {
    id: 12,
    name: 'Pirelli Angel Scooter Rear Tire 130/70-13 & Inner Tube',
    sku: 'TIR-PIR13',
    qty: 8,
    unitPrice: 2680,
    category: 'tires',
  },
  {
    id: 13,
    name: 'Full-Face DOT Certified Riding Helmet & Gloves Gear',
    sku: 'BDY-HLM01',
    qty: 16,
    unitPrice: 3200,
    category: 'body',
  },
  {
    id: 14,
    name: 'Mini Driving LED Fog Lights & Horn Wiring Kit',
    sku: 'ELC-LED02',
    qty: 24,
    unitPrice: 1150,
    category: 'electrical',
  },
  {
    id: 15,
    name: 'Racing Clutch Lining & Bell Assembly Set',
    sku: 'ENG-CLT01',
    qty: 11,
    unitPrice: 1850,
    category: 'engine',
  },
  {
    id: 16,
    name: 'Fuel Injector (FI) & Carburetor Cleaner Spray 450ml',
    sku: 'OIL-FICLN',
    qty: 30,
    unitPrice: 260,
    category: 'lubricants',
  },
];

let parts = [];
let nextId = 1;

function reset() {
  parts = INITIAL_PARTS.map((item) => ({ ...item }));
  nextId = parts.length + 1;
}

function findAll() {
  return parts.map((item) => ({ ...item }));
}

function findById(id) {
  const numericId = Number(id);
  const found = parts.find((item) => item.id === numericId);
  return found ? { ...found } : null;
}

function findBySku(sku) {
  const normalized = String(sku || '').trim().toUpperCase();
  const found = parts.find((item) => item.sku.toUpperCase() === normalized);
  return found ? { ...found } : null;
}

function save(data) {
  const record = {
    id: nextId++,
    name: data.name,
    sku: data.sku,
    qty: data.qty,
    unitPrice: data.unitPrice,
    category: data.category,
  };
  parts.push(record);
  return { ...record };
}

function update(id, data) {
  const numericId = Number(id);
  const index = parts.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return null;
  }
  const updated = {
    id: numericId,
    name: data.name,
    sku: data.sku,
    qty: data.qty,
    unitPrice: data.unitPrice,
    category: data.category,
  };
  parts[index] = updated;
  return { ...updated };
}

function restock(id, addQty) {
  const numericId = Number(id);
  const index = parts.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return null;
  }
  parts[index] = {
    ...parts[index],
    qty: parts[index].qty + addQty,
  };
  return { ...parts[index] };
}

function remove(id) {
  const numericId = Number(id);
  const index = parts.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return false;
  }
  parts.splice(index, 1);
  return true;
}

reset();

module.exports = {
  reset,
  findAll,
  findById,
  findBySku,
  save,
  update,
  restock,
  remove,
};
