/**
 * Week 4 Task 4 — Authorization Guard
 *
 * Protects sensitive actions (such as DELETE routes or editing another mechanic's record).
 * Forbidden actions return 403 { "status": 403, "error": "not allowed" }, distinct from validation's 422.
 */

const { forbiddenError } = require('../utils/response');

const ALLOWED_MANAGEMENT_ROLES = new Set(['owner', 'admin']);

function currentUserOwns(record, user) {
  if (!user) return false;
  if (ALLOWED_MANAGEMENT_ROLES.has(user.role)) return true;
  if (record && record.mechanic && user.name && record.mechanic === user.name) return true;
  if (record && record.ownerId && user.id && record.ownerId === user.id) return true;
  return false;
}

function requireAuthorized(request, record = null) {
  const headerRole =
    request &&
    request.headers &&
    (request.headers['x-user-role'] || request.headers['X-User-Role']);

  const user = (request && request.user) || {
    role: headerRole || 'owner',
  };

  if (ALLOWED_MANAGEMENT_ROLES.has(user.role)) {
    return null;
  }

  if (record && currentUserOwns(record, user)) {
    return null;
  }

  return forbiddenError('not allowed');
}

module.exports = {
  currentUserOwns,
  requireAuthorized,
};
