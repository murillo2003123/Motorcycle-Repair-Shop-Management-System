/**
 * Main Test Runner — Executes all team member test suites (Weeks 5–12)
 *
 * Team Members:
 * - Alvin Murillo          (alvinmurillo2003@gmail.com)        -> tests/customers.test.js
 * - John Angelo Cabatingan (johnangelocabatingan2003@gmail.com) -> tests/repairs.test.js
 * - Keanu Dagala           (keanudagala2003@gmail.com)         -> tests/parts.test.js
 */

const { describe, test, expect, runAllSuites } = require('./testHelper');
const { handleRequest } = require('../src/router');
const customersStore = require('../src/data/customersStore');
const repairsStore = require('../src/data/repairsStore');
const partsStore = require('../src/data/partsStore');
const config = require('../src/config');

// Load each team member's controller test suite
require('./customers.test');
require('./repairs.test');
require('./parts.test');

// Week 3 Task 3 & Week 10/11 Adversarial QA Regression Suite
describe('Routing Skeleton & Week 10/11 Adversarial QA Regressions (Murillo, Cabatingan, Dagala)', () => {
  test('DELETE /repairs with no :id returns 405 Method Not Allowed', () => {
    const result = handleRequest({ method: 'DELETE', path: '/repairs' });
    expect(result.status).toBe(405);
  });

  test('GET /unknown-endpoint returns 404 Not Found', () => {
    const result = handleRequest({ method: 'GET', path: '/unknown-endpoint' });
    expect(result.status).toBe(404);
  });

  test('POST /customers rejects stored XSS <script> tags in name with 422 (BUG-02 regression - Murillo)', () => {
    customersStore.reset();
    const result = handleRequest({
      method: 'POST',
      path: '/customers',
      body: {
        name: '<script>alert("xss")</script>',
        phone: '09171234567',
        plateNumber: 'XSS-1234',
        motorcycleModel: 'Honda Click 125i',
      },
    });
    expect(result.status).toBe(422);
    expect(result.field).toBe('name');
  });

  test('POST /repairs rejects whitespace-only issue string with 422 (BUG-04 regression - Cabatingan)', () => {
    customersStore.reset();
    repairsStore.reset();
    const result = handleRequest({
      method: 'POST',
      path: '/repairs',
      body: {
        customerId: 1,
        issue: '       ',
        mechanic: 'Berto',
        laborCost: 500,
        status: 'pending',
      },
    });
    expect(result.status).toBe(422);
    expect(result.field).toBe('issue');
    expect(result.error).toBe('issue is required');
  });

  test('POST /parts rejects duplicate SKU code with 422 (BUG-03 regression - Dagala)', () => {
    partsStore.reset();
    const result = handleRequest({
      method: 'POST',
      path: '/parts',
      body: {
        name: 'Duplicate SKU Oil',
        sku: 'OIL-10W40',
        qty: 10,
        unitPrice: 300,
        category: 'lubricants',
      },
    });
    expect(result.status).toBe(422);
    expect(result.field).toBe('sku');
    expect(result.error).toBe('sku already exists');
  });

  test('Production config has appDebug disabled by default (Week 11 Task 3)', () => {
    expect(config.appDebug).toBe(false);
  });
});

runAllSuites();
