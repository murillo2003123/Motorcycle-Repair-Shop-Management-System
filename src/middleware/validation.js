/**
 * Week 4 Task 2, Week 5 Task 1 & Week 11 Bug Fixes — Guard-Clause Input Validation
 *
 * Rules covered: presence, type, length/range, format, allowed values, referential, XSS defense.
 * Invalid input returns 422: { "status": 422, "error": "...", "field": "..." }
 * Valid input populates request.validatedBody and returns null.
 */

const { validationError } = require('../utils/response');
const customersStore = require('../data/customersStore');
const partsStore = require('../data/partsStore');

const PLATE_REGEX = /^[A-Z0-9]{2,4}-[0-9A-Z]{3,5}$/;
const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;
const SKU_REGEX = /^[A-Z0-9-]{3,20}$/;
const HTML_TAG_REGEX = /[<>]/;

const ALLOWED_REPAIR_STATUSES = new Set(['pending', 'in_progress', 'completed', 'paid']);
const ALLOWED_PART_CATEGORIES = new Set([
  'engine',
  'brakes',
  'electrical',
  'tires',
  'lubricants',
  'body',
]);

function containsHtmlTags(value) {
  return HTML_TAG_REGEX.test(value);
}

/**
 * Guard-clause validator for POST /customers and PUT /customers/:id
 * Owner: Alvin Murillo (alvinmurillo2003@gmail.com)
 */
function validateCustomerInput(request) {
  const data = (request && request.body) || {};

  // 1. name: required, string, 2–80 chars, no HTML/script tags
  if (data.name === undefined || data.name === null || data.name === '') {
    return validationError('name is required', 'name');
  }
  if (typeof data.name !== 'string') {
    return validationError('name must be a string', 'name');
  }
  const trimmedName = data.name.trim();
  if (trimmedName.length === 0) {
    return validationError('name is required', 'name');
  }
  if (containsHtmlTags(trimmedName)) {
    return validationError('name must not contain HTML or script tags', 'name');
  }
  if (trimmedName.length < 2) {
    return validationError('name is too short (min 2 chars)', 'name');
  }
  if (trimmedName.length > 80) {
    return validationError('name too long', 'name');
  }

  // 2. phone: required, string, format 7-15 digits
  if (data.phone === undefined || data.phone === null || data.phone === '') {
    return validationError('phone is required', 'phone');
  }
  if (typeof data.phone !== 'string') {
    return validationError('phone must be a string', 'phone');
  }
  const trimmedPhone = data.phone.trim();
  if (!PHONE_REGEX.test(trimmedPhone)) {
    return validationError('phone format is invalid (7-15 digits required)', 'phone');
  }

  // 3. plateNumber: required, string, format e.g. ABC-1234
  if (data.plateNumber === undefined || data.plateNumber === null || data.plateNumber === '') {
    return validationError('plateNumber is required', 'plateNumber');
  }
  if (typeof data.plateNumber !== 'string') {
    return validationError('plateNumber must be a string', 'plateNumber');
  }
  const normalizedPlate = data.plateNumber.trim().toUpperCase();
  if (!PLATE_REGEX.test(normalizedPlate)) {
    return validationError(
      'plateNumber format is invalid (expected e.g. ABC-1234)',
      'plateNumber'
    );
  }

  // 4. motorcycleModel: required, string, 2–80 chars, no HTML tags
  if (
    data.motorcycleModel === undefined ||
    data.motorcycleModel === null ||
    data.motorcycleModel === ''
  ) {
    return validationError('motorcycleModel is required', 'motorcycleModel');
  }
  if (typeof data.motorcycleModel !== 'string') {
    return validationError('motorcycleModel must be a string', 'motorcycleModel');
  }
  const trimmedModel = data.motorcycleModel.trim();
  if (trimmedModel.length === 0) {
    return validationError('motorcycleModel is required', 'motorcycleModel');
  }
  if (containsHtmlTags(trimmedModel)) {
    return validationError('motorcycleModel must not contain HTML or script tags', 'motorcycleModel');
  }
  if (trimmedModel.length < 2 || trimmedModel.length > 80) {
    return validationError('motorcycleModel length must be 2 to 80 chars', 'motorcycleModel');
  }

  request.validatedBody = {
    name: trimmedName,
    phone: trimmedPhone,
    plateNumber: normalizedPlate,
    motorcycleModel: trimmedModel,
  };

  return null;
}

/**
 * Guard-clause validator for GET /customers/plate/:plateNumber (Murillo Solo Checkpoint)
 */
function validatePlateParam(request) {
  const plateNumber = request && request.params && request.params.plateNumber;
  if (!plateNumber || typeof plateNumber !== 'string') {
    return validationError('plateNumber is required', 'plateNumber');
  }
  const normalizedPlate = plateNumber.trim().toUpperCase();
  if (!PLATE_REGEX.test(normalizedPlate)) {
    return validationError(
      'plateNumber format is invalid (expected e.g. ABC-1234)',
      'plateNumber'
    );
  }
  request.validatedParams = { plateNumber: normalizedPlate };
  return null;
}

/**
 * Guard-clause validator for POST /repairs and PUT /repairs/:id
 * Owner: John Angelo Cabatingan (johnangelocabatingan2003@gmail.com)
 */
function validateRepairInput(request) {
  const data = (request && request.body) || {};

  // 1. customerId: required, integer number, referential integrity
  if (data.customerId === undefined || data.customerId === null || data.customerId === '') {
    return validationError('customerId is required', 'customerId');
  }
  if (typeof data.customerId !== 'number' || !Number.isInteger(data.customerId)) {
    return validationError('customerId must be an integer number', 'customerId');
  }
  if (data.customerId < 1) {
    return validationError('customerId out of range', 'customerId');
  }
  if (!customersStore.findById(data.customerId)) {
    return validationError(
      'customerId does not reference an existing customer',
      'customerId'
    );
  }

  // 2. issue: required, string, 5–200 chars, no HTML tags
  if (data.issue === undefined || data.issue === null || data.issue === '') {
    return validationError('issue is required', 'issue');
  }
  if (typeof data.issue !== 'string') {
    return validationError('issue must be a string', 'issue');
  }
  const trimmedIssue = data.issue.trim();
  if (trimmedIssue.length === 0) {
    return validationError('issue is required', 'issue');
  }
  if (containsHtmlTags(trimmedIssue)) {
    return validationError('issue must not contain HTML or script tags', 'issue');
  }
  if (trimmedIssue.length < 5) {
    return validationError('issue is too short (min 5 chars)', 'issue');
  }
  if (trimmedIssue.length > 200) {
    return validationError('issue too long', 'issue');
  }

  // 3. mechanic: required, string, 2–60 chars, no HTML tags
  if (data.mechanic === undefined || data.mechanic === null || data.mechanic === '') {
    return validationError('mechanic is required', 'mechanic');
  }
  if (typeof data.mechanic !== 'string') {
    return validationError('mechanic must be a string', 'mechanic');
  }
  const trimmedMechanic = data.mechanic.trim();
  if (trimmedMechanic.length === 0) {
    return validationError('mechanic is required', 'mechanic');
  }
  if (containsHtmlTags(trimmedMechanic)) {
    return validationError('mechanic must not contain HTML or script tags', 'mechanic');
  }
  if (trimmedMechanic.length < 2 || trimmedMechanic.length > 60) {
    return validationError('mechanic length must be 2 to 60 chars', 'mechanic');
  }

  // 4. laborCost: required, number, 0–100000
  if (data.laborCost === undefined || data.laborCost === null || data.laborCost === '') {
    return validationError('laborCost is required', 'laborCost');
  }
  if (typeof data.laborCost !== 'number' || !Number.isFinite(data.laborCost)) {
    return validationError('laborCost must be a number', 'laborCost');
  }
  if (data.laborCost < 0 || data.laborCost > 100000) {
    return validationError('laborCost out of range', 'laborCost');
  }

  // 5. status: required, allowed values {pending, in_progress, completed, paid}
  if (data.status === undefined || data.status === null || data.status === '') {
    return validationError('status is required', 'status');
  }
  if (typeof data.status !== 'string' || !ALLOWED_REPAIR_STATUSES.has(data.status)) {
    return validationError('invalid status', 'status');
  }

  request.validatedBody = {
    customerId: data.customerId,
    issue: trimmedIssue,
    mechanic: trimmedMechanic,
    laborCost: data.laborCost,
    status: data.status,
  };

  return null;
}

/**
 * Guard-clause validator for PATCH /repairs/:id/status (Cabatingan Solo Checkpoint)
 */
function validateRepairStatusInput(request) {
  const data = (request && request.body) || {};

  if (data.status === undefined || data.status === null || data.status === '') {
    return validationError('status is required', 'status');
  }
  if (typeof data.status !== 'string' || !ALLOWED_REPAIR_STATUSES.has(data.status)) {
    return validationError('invalid status', 'status');
  }

  request.validatedBody = {
    status: data.status,
  };

  return null;
}

/**
 * Guard-clause validator for POST /parts and PUT /parts/:id
 * Owner: Keanu Dagala (keanudagala2003@gmail.com)
 */
function validatePartInput(request) {
  const data = (request && request.body) || {};

  // 1. name: required, string, 2–100 chars, no HTML tags
  if (data.name === undefined || data.name === null || data.name === '') {
    return validationError('name is required', 'name');
  }
  if (typeof data.name !== 'string') {
    return validationError('name must be a string', 'name');
  }
  const trimmedName = data.name.trim();
  if (trimmedName.length === 0) {
    return validationError('name is required', 'name');
  }
  if (containsHtmlTags(trimmedName)) {
    return validationError('name must not contain HTML or script tags', 'name');
  }
  if (trimmedName.length < 2) {
    return validationError('name is too short (min 2 chars)', 'name');
  }
  if (trimmedName.length > 100) {
    return validationError('name too long', 'name');
  }

  // 2. sku: required, string, format ^[A-Z0-9-]{3,20}$, unique across parts
  if (data.sku === undefined || data.sku === null || data.sku === '') {
    return validationError('sku is required', 'sku');
  }
  if (typeof data.sku !== 'string') {
    return validationError('sku must be a string', 'sku');
  }
  const normalizedSku = data.sku.trim().toUpperCase();
  if (!SKU_REGEX.test(normalizedSku)) {
    return validationError('sku format is invalid (3-20 uppercase alphanumeric/hyphen)', 'sku');
  }

  const editingId = request && request.params && request.params.id ? Number(request.params.id) : null;
  const existingWithSku = partsStore.findBySku(normalizedSku);
  if (existingWithSku && existingWithSku.id !== editingId) {
    return validationError('sku already exists', 'sku');
  }

  // 3. qty: required, integer number, 0–999
  if (data.qty === undefined || data.qty === null || data.qty === '') {
    return validationError('qty is required', 'qty');
  }
  if (typeof data.qty !== 'number' || !Number.isInteger(data.qty)) {
    return validationError('qty must be a number', 'qty');
  }
  if (data.qty < 0 || data.qty > 999) {
    return validationError('qty out of range', 'qty');
  }

  // 4. unitPrice: required, number, 1–100000
  if (data.unitPrice === undefined || data.unitPrice === null || data.unitPrice === '') {
    return validationError('unitPrice is required', 'unitPrice');
  }
  if (typeof data.unitPrice !== 'number' || !Number.isFinite(data.unitPrice)) {
    return validationError('unitPrice must be a number', 'unitPrice');
  }
  if (data.unitPrice < 1 || data.unitPrice > 100000) {
    return validationError('unitPrice out of range', 'unitPrice');
  }

  // 5. category: required, one of allowed categories
  if (data.category === undefined || data.category === null || data.category === '') {
    return validationError('category is required', 'category');
  }
  if (typeof data.category !== 'string' || !ALLOWED_PART_CATEGORIES.has(data.category)) {
    return validationError('invalid category', 'category');
  }

  request.validatedBody = {
    name: trimmedName,
    sku: normalizedSku,
    qty: data.qty,
    unitPrice: data.unitPrice,
    category: data.category,
  };

  return null;
}

/**
 * Guard-clause validator for POST /parts/:id/restock (Dagala Solo Checkpoint)
 */
function validateRestockInput(request) {
  const data = (request && request.body) || {};

  if (data.addQty === undefined || data.addQty === null || data.addQty === '') {
    return validationError('addQty is required', 'addQty');
  }
  if (typeof data.addQty !== 'number' || !Number.isInteger(data.addQty)) {
    return validationError('addQty must be a number', 'addQty');
  }
  if (data.addQty < 1 || data.addQty > 500) {
    return validationError('addQty out of range', 'addQty');
  }

  request.validatedBody = {
    addQty: data.addQty,
  };

  return null;
}

module.exports = {
  validateCustomerInput,
  validatePlateParam,
  validateRepairInput,
  validateRepairStatusInput,
  validatePartInput,
  validateRestockInput,
};
