/**
 * Automated Tests — Spare Parts Inventory Module (Week 5 Task 3 & Task 4)
 * Owner: Dagala (Scribe & Builder)
 *
 * Uses Arrange-Act-Assert (AAA) pattern covering:
 * - Happy path (200 / 201)
 * - Validation failures (422 with { status, error, field })
 * - Edge cases (404 not found, 403 unauthorized delete, shelf capacity 999 overflow)
 */

const { describe, test, expect } = require('./testHelper');
const partsStore = require('../src/data/partsStore');
const {
  listParts,
  showPart,
  createPart,
  updatePart,
  deletePart,
  restockPart,
} = require('../src/controllers/partsController');
const { fakeRequest, handleRequest } = require('../src/router');

describe('Spare Parts Inventory Controllers — Owner: Dagala', () => {
  // 1. listParts
  test('listParts returns all spare parts in inventory (happy path)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/parts' });

    // Act
    const result = listParts(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(2);
    expect(result.data[0].sku).toBe('OIL-10W40');
  });

  // 2. showPart
  test('showPart returns a single spare part by ID (happy path)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/parts/2', params: { id: '2' } });

    // Act
    const result = showPart(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(2);
    expect(result.data.category).toBe('brakes');
  });

  test('showPart returns 404 when spare part ID does not exist (edge case)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/parts/999', params: { id: '999' } });

    // Act
    const result = showPart(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('part not found');
  });

  // 3. createPart
  test('createPart saves a valid spare part record (happy path)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/parts',
      body: {
        name: 'NGK Iridium Spark Plug',
        sku: 'spk-ngk01',
        qty: 40,
        unitPrice: 480,
        category: 'electrical',
      },
    });

    // Act
    const result = createPart(request);

    // Assert
    expect(result.status).toBe(201);
    expect(result.data.id).toBe(3);
    expect(result.data.sku).toBe('SPK-NGK01');
    expect(result.data.qty).toBe(40);
  });

  test('createPart rejects non-numeric qty ("cake") with 422 (validation failure)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/parts',
      body: {
        name: 'NGK Iridium Spark Plug',
        sku: 'SPK-NGK01',
        qty: 'cake',
        unitPrice: 480,
        category: 'electrical',
      },
    });

    // Act
    const result = createPart(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('qty');
    expect(result.error).toBe('qty must be a number');
  });

  test('createPart rejects out-of-range qty (> 999) with 422 (edge case)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/parts',
      body: {
        name: 'NGK Iridium Spark Plug',
        sku: 'SPK-NGK01',
        qty: 1000,
        unitPrice: 480,
        category: 'electrical',
      },
    });

    // Act
    const result = createPart(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('qty');
    expect(result.error).toBe('qty out of range');
  });

  // 4. updatePart
  test('updatePart updates an existing spare part (happy path)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/parts/1',
      params: { id: '1' },
      body: {
        name: 'Synthetic Scooter Oil 10W-40 1L',
        sku: 'OIL-10W40',
        qty: 30,
        unitPrice: 350,
        category: 'lubricants',
      },
    });

    // Act
    const result = updatePart(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.qty).toBe(30);
    expect(result.data.unitPrice).toBe(350);
  });

  test('updatePart rejects invalid category with 422 (validation failure)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/parts/1',
      params: { id: '1' },
      body: {
        name: 'Synthetic Scooter Oil 10W-40',
        sku: 'OIL-10W40',
        qty: 25,
        unitPrice: 320,
        category: 'groceries',
      },
    });

    // Act
    const result = updatePart(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('category');
    expect(result.error).toBe('invalid category');
  });

  test('updatePart returns 404 when part ID does not exist (edge case)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/parts/404',
      params: { id: '404' },
      body: {
        name: 'Tubeless Tire 90/80-14',
        sku: 'TIR-908014',
        qty: 10,
        unitPrice: 1450,
        category: 'tires',
      },
    });

    // Act
    const result = updatePart(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('part not found');
  });

  // 5. deletePart
  test('deletePart deletes an existing part when user is owner (happy path)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/parts/2',
      params: { id: '2' },
      user: { role: 'owner' },
    });

    // Act
    const result = deletePart(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.deleted).toBe(true);
    expect(partsStore.findById(2)).toBe(null);
  });

  test('deletePart returns 403 when user role is customer (auth guard failure)', () => {
    // Arrange
    partsStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/parts/1',
      params: { id: '1' },
      user: { role: 'customer' },
    });

    // Act
    const result = deletePart(request);

    // Assert
    expect(result.status).toBe(403);
    expect(result.error).toBe('not allowed');
  });

  // 6. Dagala Solo Checkpoint: POST /parts/:id/restock
  test('restockPart increments part stock quantity via router pipeline (happy path)', () => {
    // Arrange
    partsStore.reset();

    // Act
    const result = handleRequest({
      method: 'POST',
      path: '/parts/1/restock',
      body: { addQty: 15 },
    });

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(1);
    expect(result.data.qty).toBe(40); // 25 initial + 15 restocked
  });

  test('restockPart rejects negative addQty with 422 (validation failure)', () => {
    // Arrange
    partsStore.reset();

    // Act
    const result = handleRequest({
      method: 'POST',
      path: '/parts/1/restock',
      body: { addQty: -5 },
    });

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('addQty');
    expect(result.error).toBe('addQty out of range');
  });

  test('restockPart rejects restock when resulting qty exceeds max capacity 999 (edge case)', () => {
    // Arrange
    partsStore.reset();
    partsStore.update(1, {
      name: 'Synthetic Scooter Oil 10W-40',
      sku: 'OIL-10W40',
      qty: 800,
      unitPrice: 320,
      category: 'lubricants',
    });
    const request = fakeRequest({
      method: 'POST',
      path: '/parts/1/restock',
      params: { id: '1' },
      body: { addQty: 250 },
    });

    // Act
    const result = restockPart(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('addQty');
  });
});
