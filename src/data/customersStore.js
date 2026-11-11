/**
 * Data Layer — Customers & Motorcycles Store
 * Owner: Alvin Murillo (Repo Lead & Builder)
 */

const INITIAL_CUSTOMERS = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    phone: '09171234567',
    plateNumber: 'ABC-1234',
    motorcycleModel: 'Honda Click 125i',
  },
  {
    id: 2,
    name: 'Maria Santos',
    phone: '09187654321',
    plateNumber: 'XYZ-9876',
    motorcycleModel: 'Yamaha NMAX 155',
  },
];

let customers = [];
let nextId = 1;

function reset() {
  customers = INITIAL_CUSTOMERS.map((item) => ({ ...item }));
  nextId = customers.length + 1;
}

function findAll() {
  return customers.map((item) => ({ ...item }));
}

function findById(id) {
  const numericId = Number(id);
  const found = customers.find((item) => item.id === numericId);
  return found ? { ...found } : null;
}

function findByPlate(plateNumber) {
  const normalized = String(plateNumber || '').trim().toUpperCase();
  const found = customers.find((item) => item.plateNumber.toUpperCase() === normalized);
  return found ? { ...found } : null;
}

function save(data) {
  const record = {
    id: nextId++,
    name: data.name,
    phone: data.phone,
    plateNumber: data.plateNumber,
    motorcycleModel: data.motorcycleModel,
  };
  customers.push(record);
  return { ...record };
}

function update(id, data) {
  const numericId = Number(id);
  const index = customers.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return null;
  }
  const updated = {
    id: numericId,
    name: data.name,
    phone: data.phone,
    plateNumber: data.plateNumber,
    motorcycleModel: data.motorcycleModel,
  };
  customers[index] = updated;
  return { ...updated };
}

function remove(id) {
  const numericId = Number(id);
  const index = customers.findIndex((item) => item.id === numericId);
  if (index === -1) {
    return false;
  }
  customers.splice(index, 1);
  return true;
}

reset();

module.exports = {
  reset,
  findAll,
  findById,
  findByPlate,
  save,
  update,
  remove,
};
