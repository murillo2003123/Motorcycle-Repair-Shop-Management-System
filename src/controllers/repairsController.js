/**
 * Thin Controllers — Repair Job Orders
 * Owner: Cabatingan (Board Lead & Builder)
 */

const repairsStore = require('../data/repairsStore');
const { response, notFoundError } = require('../utils/response');
const { validateRepairInput, validateRepairStatusInput } = require('../middleware/validation');
const { requireAuthorized } = require('../middleware/auth');

function listRepairs() {
  const records = repairsStore.findAll();
  return response(200, { data: records });
}

function showRepair(request) {
  const id = request && request.params && request.params.id;
  const repair = repairsStore.findById(id);
  if (!repair) {
    return notFoundError('repair order not found');
  }
  return response(200, { data: repair });
}

function createRepair(request) {
  if (!request.validatedBody) {
    const validationErr = validateRepairInput(request);
    if (validationErr) return validationErr;
  }
  const data = request.validatedBody;
  const repair = repairsStore.save(data);
  return response(201, { data: repair });
}

function updateRepair(request) {
  if (!request.validatedBody) {
    const validationErr = validateRepairInput(request);
    if (validationErr) return validationErr;
  }
  const id = request && request.params && request.params.id;
  const data = request.validatedBody;
  const updated = repairsStore.update(id, data);
  if (!updated) {
    return notFoundError('repair order not found');
  }
  return response(200, { data: updated });
}

function deleteRepair(request) {
  const id = Number(request && request.params && request.params.id);
  const existing = repairsStore.findById(id);

  const authErr = requireAuthorized(request, existing);
  if (authErr) return authErr;

  if (!existing) {
    return notFoundError('repair order not found');
  }

  repairsStore.remove(id);
  return response(200, { data: { deleted: true, id } });
}

/**
 * Cabatingan — Week 5 Solo Checkpoint Route
 * PATCH /repairs/:id/status
 */
function updateRepairStatus(request) {
  if (!request.validatedBody) {
    const validationErr = validateRepairStatusInput(request);
    if (validationErr) return validationErr;
  }
  const id = request && request.params && request.params.id;
  const { status } = request.validatedBody;
  const updated = repairsStore.updateStatus(id, status);
  if (!updated) {
    return notFoundError('repair order not found');
  }
  return response(200, { data: updated });
}

module.exports = {
  listRepairs,
  showRepair,
  createRepair,
  updateRepair,
  deleteRepair,
  updateRepairStatus,
};
