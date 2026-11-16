/**
 * Thin Controllers — Spare Parts Inventory
 * Owner: Dagala (Scribe & Builder)
 */

const partsStore = require('../data/partsStore');
const { response, notFoundError, validationError } = require('../utils/response');
const { validatePartInput, validateRestockInput } = require('../middleware/validation');
const { requireAuthorized } = require('../middleware/auth');

function listParts() {
  const records = partsStore.findAll();
  return response(200, { data: records });
}

function showPart(request) {
  const id = request && request.params && request.params.id;
  const part = partsStore.findById(id);
  if (!part) {
    return notFoundError('part not found');
  }
  return response(200, { data: part });
}

function createPart(request) {
  if (!request.validatedBody) {
    const validationErr = validatePartInput(request);
    if (validationErr) return validationErr;
  }
  const data = request.validatedBody;
  const part = partsStore.save(data);
  return response(201, { data: part });
}

function updatePart(request) {
  if (!request.validatedBody) {
    const validationErr = validatePartInput(request);
    if (validationErr) return validationErr;
  }
  const id = request && request.params && request.params.id;
  const data = request.validatedBody;
  const updated = partsStore.update(id, data);
  if (!updated) {
    return notFoundError('part not found');
  }
  return response(200, { data: updated });
}

function deletePart(request) {
  const authErr = requireAuthorized(request);
  if (authErr) return authErr;

  const id = Number(request && request.params && request.params.id);
  const removed = partsStore.remove(id);
  if (!removed) {
    return notFoundError('part not found');
  }
  return response(200, { data: { deleted: true, id } });
}

/**
 * Dagala — Week 5 Solo Checkpoint Route
 * POST /parts/:id/restock
 */
function restockPart(request) {
  if (!request.validatedBody) {
    const validationErr = validateRestockInput(request);
    if (validationErr) return validationErr;
  }
  const id = request && request.params && request.params.id;
  const existing = partsStore.findById(id);
  if (!existing) {
    return notFoundError('part not found');
  }

  const { addQty } = request.validatedBody;
  if (existing.qty + addQty > 999) {
    return validationError('qty out of range (max shelf capacity is 999)', 'addQty');
  }

  const updated = partsStore.restock(id, addQty);
  return response(200, { data: updated });
}

module.exports = {
  listParts,
  showPart,
  createPart,
  updatePart,
  deletePart,
  restockPart,
};
