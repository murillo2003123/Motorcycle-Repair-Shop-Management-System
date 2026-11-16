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
