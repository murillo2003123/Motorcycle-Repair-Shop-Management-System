/**
 * Automated Tests — Customers & Motorcycles Module (Week 5 Task 3 & Task 4)
 * Owner: Alvin Murillo (Repo Lead & Builder)
 *
 * Uses Arrange-Act-Assert (AAA) pattern covering:
 * - Happy path (200 / 201)
 * - Validation failures (422 with { status, error, field })
 * - Edge cases (404 not found, 403 unauthorized delete, plate normalization)
 */

const { describe, test, expect } = require('./testHelper');
const customersStore = require('../src/data/customersStore');
const {
  listCustomers,
  showCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  findCustomerByPlate,
} = require('../src/controllers/customersController');
const { fakeRequest, handleRequest } = require('../src/router');

describe('Customers & Motorcycles Controllers — Owner: Alvin Murillo', () => {
  // 1. listCustomers
  test('listCustomers returns all seeded customers (happy path)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/customers' });

    // Act
    const result = listCustomers(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.length).toBe(2);
    expect(result.data[0].plateNumber).toBe('ABC-1234');
  });

  test('listCustomers returns empty array when all customers are removed (edge case)', () => {
    // Arrange
    customersStore.reset();
    customersStore.remove(1);
    customersStore.remove(2);
    const request = fakeRequest({ method: 'GET', path: '/customers' });

    // Act
    const result = listCustomers(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data).toEqual([]);
  });

  // 2. showCustomer
  test('showCustomer returns a single customer record by ID (happy path)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/customers/1', params: { id: '1' } });

    // Act
    const result = showCustomer(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(1);
    expect(result.data.name).toBe('Juan Dela Cruz');
  });

  test('showCustomer returns 404 when customer ID does not exist (edge case)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({ method: 'GET', path: '/customers/999', params: { id: '999' } });

    // Act
    const result = showCustomer(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('customer not found');
  });

  // 3. createCustomer
  test('createCustomer saves a valid customer and motorcycle record (happy path)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/customers',
      body: {
        name: 'Carlo Mendoza',
        phone: '09192223344',
        plateNumber: 'mtr-5588',
        motorcycleModel: 'Yamaha Mio Aerox 155',
      },
    });

    // Act
    const result = createCustomer(request);

    // Assert
    expect(result.status).toBe(201);
    expect(result.data.id).toBe(3);
    expect(result.data.name).toBe('Carlo Mendoza');
    expect(result.data.plateNumber).toBe('MTR-5588');
  });

  test('createCustomer rejects missing customer name with 422 (validation failure)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/customers',
      body: {
        phone: '09192223344',
        plateNumber: 'MTR-5588',
        motorcycleModel: 'Yamaha Mio Aerox 155',
      },
    });

    // Act
    const result = createCustomer(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('name');
    expect(result.error).toBe('name is required');
  });

  test('createCustomer rejects invalid plateNumber format with 422 (edge case)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'POST',
      path: '/customers',
      body: {
        name: 'Carlo Mendoza',
        phone: '09192223344',
        plateNumber: 'INVALIDPLATE',
        motorcycleModel: 'Yamaha Mio Aerox 155',
      },
    });

    // Act
    const result = createCustomer(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('plateNumber');
  });

  // 4. updateCustomer
  test('updateCustomer updates an existing customer record (happy path)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/customers/1',
      params: { id: '1' },
      body: {
        name: 'Juan Dela Cruz Jr.',
        phone: '09179998888',
        plateNumber: 'ABC-1234',
        motorcycleModel: 'Honda ADV 160',
      },
    });

    // Act
    const result = updateCustomer(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.name).toBe('Juan Dela Cruz Jr.');
    expect(result.data.motorcycleModel).toBe('Honda ADV 160');
  });

  test('updateCustomer rejects invalid phone format with 422 (validation failure)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/customers/1',
      params: { id: '1' },
      body: {
        name: 'Juan Dela Cruz',
        phone: 'abc-not-a-phone',
        plateNumber: 'ABC-1234',
        motorcycleModel: 'Honda Click 125i',
      },
    });

    // Act
    const result = updateCustomer(request);

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('phone');
  });

  test('updateCustomer returns 404 when customer ID does not exist (edge case)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'PUT',
      path: '/customers/888',
      params: { id: '888' },
      body: {
        name: 'Ghost Rider',
        phone: '09171112222',
        plateNumber: 'GHT-0001',
        motorcycleModel: 'Kawasaki Ninja 400',
      },
    });

    // Act
    const result = updateCustomer(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('customer not found');
  });

  // 5. deleteCustomer
  test('deleteCustomer deletes an existing customer when user is owner (happy path)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/customers/2',
      params: { id: '2' },
      user: { role: 'owner' },
    });

    // Act
    const result = deleteCustomer(request);

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.deleted).toBe(true);
    expect(customersStore.findById(2)).toBe(null);
  });

  test('deleteCustomer returns 403 when user is unauthorized guest (auth guard failure)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/customers/1',
      params: { id: '1' },
      user: { role: 'guest' },
    });

    // Act
    const result = deleteCustomer(request);

    // Assert
    expect(result.status).toBe(403);
    expect(result.error).toBe('not allowed');
  });

  test('deleteCustomer returns 404 when customer ID does not exist (edge case)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'DELETE',
      path: '/customers/777',
      params: { id: '777' },
      user: { role: 'owner' },
    });

    // Act
    const result = deleteCustomer(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('customer not found');
  });

  // 6. Murillo Solo Checkpoint: GET /customers/plate/:plateNumber
  test('findCustomerByPlate returns matching customer record via router pipeline (happy path)', () => {
    // Arrange
    customersStore.reset();

    // Act
    const result = handleRequest({
      method: 'GET',
      path: '/customers/plate/ABC-1234',
    });

    // Assert
    expect(result.status).toBe(200);
    expect(result.data.id).toBe(1);
    expect(result.data.name).toBe('Juan Dela Cruz');
  });

  test('findCustomerByPlate rejects malformed plate number with 422 (validation failure)', () => {
    // Arrange
    customersStore.reset();

    // Act
    const result = handleRequest({
      method: 'GET',
      path: '/customers/plate/bad_plate',
    });

    // Assert
    expect(result.status).toBe(422);
    expect(result.field).toBe('plateNumber');
  });

  test('findCustomerByPlate returns 404 for unregistered valid plate (edge case)', () => {
    // Arrange
    customersStore.reset();
    const request = fakeRequest({
      method: 'GET',
      path: '/customers/plate/ZZZ-9999',
      params: { plateNumber: 'ZZZ-9999' },
    });

    // Act
    const result = findCustomerByPlate(request);

    // Assert
    expect(result.status).toBe(404);
    expect(result.error).toBe('customer not found');
  });
});
