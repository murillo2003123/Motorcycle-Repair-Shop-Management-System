/**
 * Data Layer — Repair Job Orders Store
 * Owner: Cabatingan (Board Lead & Builder)
 */

const INITIAL_REPAIRS = [
  {
    id: 1,
    customerId: 1,
    issue: 'Full CVT cleaning and engine oil change',
    mechanic: 'Berto',
    laborCost: 850,
    status: 'in_progress',
  },
  {
    id: 2,
    customerId: 2,
    issue: 'Front brake pad replacement and fluid bleed',
    mechanic: 'Dante',
    laborCost: 450,
    status: 'pending',
  },
];

let repairs = [];
let nextId = 1;

function reset() {
  repairs = INITIAL_REPAIRS.map((item) => ({ ...item }));
  nextId = repairs.length + 1;
}

function findAll() {
  return repairs.map((item) => ({ ...item }));
}

function findById(id) {
  const numericId = Number(id);
  const found = repairs.find((item) => item.id === numericId);
  return found ? { ...found } : null;
}

function save(data) {
  const record = {
    id: nextId++,
    customerId: data.customerId,
    issue: data.issue,
    mechanic: data.mechanic,
    laborCost: data.laborCost,
    status: data.status,
  };
  repairs.push(record);
  return { ...record };
}

function update(id, data) {
  const numericId = Number(id);
  const index = repairs.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return null;
  }
  const updated = {
    id: numericId,
    customerId: data.customerId,
    issue: data.issue,
    mechanic: data.mechanic,
    laborCost: data.laborCost,
    status: data.status,
  };
  repairs[index] = updated;
  return { ...updated };
}

function updateStatus(id, status) {
  const numericId = Number(id);
  const index = repairs.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return null;
  }
  repairs[index] = {
    ...repairs[index],
    status,
  };
  return { ...repairs[index] };
}

function remove(id) {
  const numericId = Number(id);
  const index = repairs.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return false;
  }
  repairs.splice(index, 1);
  return true;
}

reset();

module.exports = {
  reset,
  findAll,
  findById,
  save,
  update,
  updateStatus,
  remove,
};
