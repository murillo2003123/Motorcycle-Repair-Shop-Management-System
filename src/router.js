/**
 * End-to-End Routing Skeleton & Pipeline (Weeks 3, 4 & 5)
 *
 * Pipeline: Route Match -> Validation Middleware -> Thin Controller -> Standardized Response
 */

const {
  listCustomers,
  showCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  findCustomerByPlate,
} = require('./controllers/customersController');

const {
  listRepairs,
  showRepair,
  createRepair,
  updateRepair,
  deleteRepair,
  updateRepairStatus,
} = require('./controllers/repairsController');

const {
  listParts,
  showPart,
  createPart,
  updatePart,
  deletePart,
  restockPart,
} = require('./controllers/partsController');

const {
  validateCustomerInput,
  validatePlateParam,
  validateRepairInput,
  validateRepairStatusInput,
  validatePartInput,
  validateRestockInput,
} = require('./middleware/validation');

const { notFoundError, methodNotAllowedError } = require('./utils/response');

const ROUTES = [
  // Module 1: Customers & Motorcycles (Owner: Alvin Murillo)
  { method: 'GET', path: '/customers', validate: null, handler: listCustomers, owner: 'Murillo' },
  {
    method: 'GET',
    path: '/customers/plate/:plateNumber',
    validate: validatePlateParam,
    handler: findCustomerByPlate,
    owner: 'Murillo',
  },
  { method: 'GET', path: '/customers/:id', validate: null, handler: showCustomer, owner: 'Murillo' },
  {
    method: 'POST',
    path: '/customers',
    validate: validateCustomerInput,
    handler: createCustomer,
    owner: 'Murillo',
  },
  {
    method: 'PUT',
    path: '/customers/:id',
    validate: validateCustomerInput,
    handler: updateCustomer,
    owner: 'Murillo',
  },
  {
    method: 'DELETE',
    path: '/customers/:id',
    validate: null,
    handler: deleteCustomer,
    owner: 'Murillo',
  },

  // Module 2: Repair Job Orders (Owner: Cabatingan)
  { method: 'GET', path: '/repairs', validate: null, handler: listRepairs, owner: 'Cabatingan' },
  { method: 'GET', path: '/repairs/:id', validate: null, handler: showRepair, owner: 'Cabatingan' },
  {
    method: 'POST',
    path: '/repairs',
    validate: validateRepairInput,
    handler: createRepair,
    owner: 'Cabatingan',
  },
  {
    method: 'PUT',
    path: '/repairs/:id',
    validate: validateRepairInput,
    handler: updateRepair,
    owner: 'Cabatingan',
  },
  {
    method: 'PATCH',
    path: '/repairs/:id/status',
    validate: validateRepairStatusInput,
    handler: updateRepairStatus,
    owner: 'Cabatingan',
  },
  {
    method: 'DELETE',
    path: '/repairs/:id',
    validate: null,
    handler: deleteRepair,
    owner: 'Cabatingan',
  },

  // Module 3: Spare Parts Inventory (Owner: Dagala)
  { method: 'GET', path: '/parts', validate: null, handler: listParts, owner: 'Dagala' },
  { method: 'GET', path: '/parts/:id', validate: null, handler: showPart, owner: 'Dagala' },
  {
    method: 'POST',
    path: '/parts',
    validate: validatePartInput,
    handler: createPart,
    owner: 'Dagala',
  },
  {
    method: 'PUT',
    path: '/parts/:id',
    validate: validatePartInput,
    handler: updatePart,
    owner: 'Dagala',
  },
  {
    method: 'POST',
    path: '/parts/:id/restock',
    validate: validateRestockInput,
    handler: restockPart,
    owner: 'Dagala',
  },
  {
    method: 'DELETE',
    path: '/parts/:id',
    validate: null,
    handler: deletePart,
    owner: 'Dagala',
  },
];

function matchPath(routePattern, actualPath) {
  const cleanActual = actualPath.split('?')[0].replace(/\/+$/, '') || '/';
  const routeParts = routePattern.split('/').filter(Boolean);
  const actualParts = cleanActual.split('/').filter(Boolean);

  if (routeParts.length !== actualParts.length) {
    return null;
  }

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    const routeSegment = routeParts[i];
    const actualSegment = actualParts[i];
    if (routeSegment.startsWith(':')) {
      const paramName = routeSegment.slice(1);
      params[paramName] = decodeURIComponent(actualSegment);
    } else if (routeSegment !== actualSegment) {
      return null;
    }
  }
  return params;
}

/**
 * Helper matching Week 5 Task 3 pseudocode:
 * request = fakeRequest({ method, path, params, body, user, headers })
 */
function fakeRequest(options = {}) {
  return {
    method: (options.method || 'GET').toUpperCase(),
    path: options.path || '/',
    params: options.params ? { ...options.params } : {},
    body: options.body ? { ...options.body } : {},
    user: options.user || { role: 'owner', name: 'Shop Owner' },
    headers: options.headers || {},
  };
}

/**
 * Dispatches a request through the Route -> Validation -> Controller pipeline.
 */
function handleRequest(rawRequest) {
  const request = {
    method: (rawRequest.method || 'GET').toUpperCase(),
    path: rawRequest.path || '/',
    params: rawRequest.params ? { ...rawRequest.params } : {},
    body: rawRequest.body || {},
    user: rawRequest.user || undefined,
    headers: rawRequest.headers || {},
  };

  let pathMatchedWithDifferentMethod = false;

  for (const route of ROUTES) {
    const extractedParams = matchPath(route.path, request.path);
    if (extractedParams !== null) {
      if (route.method !== request.method) {
        pathMatchedWithDifferentMethod = true;
        continue;
      }

      request.params = { ...extractedParams, ...request.params };

      if (route.validate) {
        const validationResult = route.validate(request);
        if (validationResult) {
          return validationResult;
        }
      }

      return route.handler(request);
    }
  }

  if (pathMatchedWithDifferentMethod) {
    return methodNotAllowedError(request.method, request.path);
  }

  return notFoundError(`Route ${request.method} ${request.path} not found`);
}

module.exports = {
  ROUTES,
  fakeRequest,
  handleRequest,
};
