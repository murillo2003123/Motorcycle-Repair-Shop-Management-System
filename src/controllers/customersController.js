/**
 * Thin Controllers — Customers & Motorcycles
 * Owner: Alvin Murillo (Repo Lead & Builder)
 */

const customersStore = require('../data/customersStore');
const { response, notFoundError } = require('../utils/response');
const { validateCustomerInput, validatePlateParam } = require('../middleware/validation');
const { requireAuthorized } = require('../middleware/auth');

function listCustomers() {
  const records = customersStore.findAll();
  return response(200, { data: records });
}

function showCustomer(request) {
  const id = request && request.params && request.params.id;
  const customer = customersStore.findById(id);
  if (!customer) {
    return notFoundError('customer not found');
  }
  return response(200, { data: customer });
}

function createCustomer(request) {
  if (!request.validatedBody) {
    const validationErr = validateCustomerInput(request);
    if (validationErr) return validationErr;
  }
  const data = request.validatedBody;
  const customer = customersStore.save(data);
  return response(201, { data: customer });
}

function updateCustomer(request) {
  if (!request.validatedBody) {
    const validationErr = validateCustomerInput(request);
    if (validationErr) return validationErr;
  }
  const id = request && request.params && request.params.id;
  const data = request.validatedBody;
  const updated = customersStore.update(id, data);
  if (!updated) {
    return notFoundError('customer not found');
  }
  return response(200, { data: updated });
}

function deleteCustomer(request) {
  const authErr = requireAuthorized(request);
  if (authErr) return authErr;

  const id = Number(request && request.params && request.params.id);
  const removed = customersStore.remove(id);
  if (!removed) {
    return notFoundError('customer not found');
  }
  return response(200, { data: { deleted: true, id } });
}

/**
 * Alvin Murillo — Week 5 Solo Checkpoint Route
 * GET /customers/plate/:plateNumber
 */
function findCustomerByPlate(request) {
  if (!request.validatedParams) {
    const validationErr = validatePlateParam(request);
    if (validationErr) return validationErr;
  }
  const { plateNumber } = request.validatedParams;
  const customer = customersStore.findByPlate(plateNumber);
  if (!customer) {
    return notFoundError('customer not found');
  }
  return response(200, { data: customer });
}

module.exports = {
  listCustomers,
  showCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  findCustomerByPlate,
};
