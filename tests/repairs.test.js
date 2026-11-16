/**
 * Automated Tests — Repair Job Orders Module (Week 5 Task 3 & Task 4)
 * Owner: Cabatingan (Board Lead & Builder)
 *
 * Uses Arrange-Act-Assert (AAA) pattern covering:
 * - Happy path (200 / 201)
 * - Validation failures (422 with { status, error, field })
 * - Edge cases (404 not found, 403 unauthorized delete, referential integrity check)
 */

const { describe, test, expect } = require('./testHelper');
const customersStore = require('../src/data/customersStore');
const repairsStore = require('../src/data/repairsStore');
const {
  listRepairs,
  showRepair,
  createRepair,
  updateRepair,
  deleteRepair,
  updateRepairStatus,
} = require('../src/controllers/repairsController');
const { fakeRequest, handleRequest } = require('../src/router');

describe('Repair Job Orders Controllers — Owner: Cabatingan', () => {
  // 1. listRepairs
  test('listRepairs returns all repair job orders (happy path)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/repairs' });

    // Act
    const result = listRepairs(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(2);
    expect(result.data[0].mechanic).toBe('Berto');
  });

  // 2. showRepair
  test('showRepair returns a single repair job order by ID (happy path)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/repairs/1', params: { id: '1' } });

    // Act
    const result = showRepair(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(1);
    expect(result.data.status).toBe('in_progress');
  });

  test('showRepair returns 404 when repair ID does not exist (edge case)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/repairs/404', params: { id: '404' } });

    // Act
    const result = showRepair(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('repair order not found');
  });

  // 3. createRepair
  test('createRepair saves a valid repair job order (happy path)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/repairs',
      body: {
        customerId: 1,
        issue: 'Replace worn drive chain and sprockets',
        mechanic: 'Dante',
        laborCost: 600,
        status: 'pending',
      },
    });

    // Act
    const result = createRepair(request);

    // Assert
    expect(result.status).toBe(201);
    expect(result.data.id).toBe(3);
    expect(result.data.customerId).toBe(1);
    expect(result.data.laborCost).toBe(600);
  });

  test('createRepair rejects negative laborCost with 422 (validation failure)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/repairs',
      body: {
        customerId: 1,
        issue: 'Replace worn drive chain and sprockets',
        mechanic: 'Dante',
        laborCost: -150,
        status: 'pending',
      },
    });

    // Act
    const result = createRepair(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('laborCost');
    expect(result.error).toBe('laborCost out of range');
  });

  test('createRepair rejects non-existent customerId with 422 (referential edge case)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/repairs',
      body: {
        customerId: 9999,
        issue: 'Electrical wiring harness repair',
        mechanic: 'Berto',
        laborCost: 750,
        status: 'pending',
      },
    });

    // Act
    const result = createRepair(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('customerId');
    expect(result.error).toBe('customerId does not reference an existing customer');
  });

  // 4. updateRepair
  test('updateRepair updates an existing repair job order (happy path)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/repairs/1',
      params: { id: '1' },
      body: {
        customerId: 1,
        issue: 'Full CVT cleaning, belt replacement, and engine oil change',
        mechanic: 'Berto',
        laborCost: 1200,
        status: 'completed',
      },
    });

    // Act
    const result = updateRepair(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.laborCost).toBe(1200);
    expect(result.data.status).toBe('completed');
  });

  test('updateRepair rejects invalid status value with 422 (validation failure)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/repairs/1',
      params: { id: '1' },
      body: {
        customerId: 1,
        issue: 'Full CVT cleaning and engine oil change',
        mechanic: 'Berto',
        laborCost: 850,
        status: 'unknown_status',
      },
    });

    // Act
    const result = updateRepair(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('status');
    expect(result.error).toBe('invalid status');
  });

  test('updateRepair returns 404 when repair ID does not exist (edge case)', () => {
    // Arrange
    customersStore.reset();
    repairsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/repairs/555',
      params: { id: '555' },
      body: {
        customerId: 1,
        issue: 'Full CVT cleaning and engine oil change',
        mechanic: 'Berto',
        laborCost: 850,
        status: 'pending',
      },
    });

    // Act
    const result = updateRepair(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('repair order not found');
  });

  // 5. deleteRepair
  test('deleteRepair removes repair order when user is authorized owner (happy path)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/repairs/2',
      params: { id: '2' },
      user: { role: 'owner' },
    });

    // Act
    const result = deleteRepair(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.deleted).toBe(true);
    expect(repairsStore.findById(2)).toBe(null);
  });

  test('deleteRepair returns 403 when a different mechanic tries to delete order (auth guard failure)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/repairs/1',
      params: { id: '1' },
      user: { role: 'mechanic', name: 'OtherMechanic' },
    });

    // Act
    const result = deleteRepair(request);

    // Assert
    expect(result.status).toBe(403);
    expect(result.error).toBe('not allowed');
  });

  test('deleteRepair allows assigned mechanic who owns the job order to delete it (edge case)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/repairs/1',
      params: { id: '1' },
      user: { role: 'mechanic', name: 'Berto' },
    });

    // Act
    const result = deleteRepair(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.deleted).toBe(true);
  });

  // 6. Cabatingan Solo Checkpoint: PATCH /repairs/:id/status
  test('updateRepairStatus updates status to paid via router pipeline (happy path)', () => {
    // Arrange
    repairsStore.reset();

    // Act
    const result = handleRequest({
      method: 'PATCH',
      path: '/repairs/1/status',
      body: { status: 'paid' },
    });

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(1);
    expect(result.data.status).toBe('paid');
  });

  test('updateRepairStatus rejects disallowed status with 422 (validation failure)', () => {
    // Arrange
    repairsStore.reset();

    // Act
    const result = handleRequest({
      method: 'PATCH',
      path: '/repairs/1/status',
      body: { status: 'abandoned' },
    });

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('status');
    expect(result.error).toBe('invalid status');
  });

  test('updateRepairStatus returns 404 when repair order ID is not found (edge case)', () => {
    // Arrange
    repairsStore.reset();
    const request = fakeRequest({
      method: 'PATCH',
      path: '/repairs/999/status',
      params: { id: '999' },
      body: { status: 'completed' },
    });

    // Act
    const result = updateRepairStatus(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('repair order not found');
  });
});
