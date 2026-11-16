/**
 * Standardized Response Envelopes (Week 4 Task 3 & Week 5 Task 2)
 *
 * Success shape: { "status": 200 | 201, "data": { ...record... } }
 * Error shape:   { "status": 422, "error": "qty out of range", "field": "qty" }
 * Auth shape:    { "status": 403, "error": "not allowed" }
 */

function response(status, payload = {}) {
  if (Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return {
      status,
      data: payload.data,
    };
  }

  const envelope = {
    status,
    error: payload.error || 'unexpected error',
  };

  if (payload.field) {
    envelope.field = payload.field;
  }

  return envelope;
}

function successResponse(status, data) {
  return response(status, { data });
}

function validationError(message, field) {
  return response(422, { error: message, field });
}

function forbiddenError(message = 'not allowed') {
  return response(403, { error: message });
}

function notFoundError(message = 'record not found') {
  return response(404, { error: message });
}

function methodNotAllowedError(method, path) {
  return response(405, { error: `Method ${method} not allowed on ${path}` });
}

module.exports = {
  response,
  successResponse,
  validationError,
  forbiddenError,
  notFoundError,
  methodNotAllowedError,
};
