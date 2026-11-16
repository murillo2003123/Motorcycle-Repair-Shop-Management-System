# Week 3 — Routing Table & Route Verification Log (`/docs/routes.md`)

**Consistent Response Envelope Agreed by Team (Murillo, Cabatingan, Dagala):**
- **Success:** `{ "status": <200|201>, "data": <record or array> }`
- **Validation Error (`422`):** `{ "status": 422, "error": "<human-readable message>", "field": "<fieldName>" }`
- **Forbidden Error (`403`):** `{ "status": 403, "error": "not allowed" }`
- **Not Found / Method Error (`404` / `405`):** `{ "status": <404|405>, "error": "<message>" }`

---

## Task 1 — Full RESTful Routing Table

### 1. Customers & Motorcycles (`customers`) — Owner: Alvin Murillo

| Method | Path | Handler | Story it serves |
| :--- | :--- | :--- | :--- |
| `GET` | `/customers` | `listCustomers` | View all customers and registered motorcycles (`US-C1`) |
| `GET` | `/customers/:id` | `showCustomer` | View one customer and motorcycle by ID (`US-C2`) |
| `POST` | `/customers` | `createCustomer` | Register a new customer and motorcycle (`US-C3`) |
| `PUT` | `/customers/:id` | `updateCustomer` | Edit an existing customer and motorcycle (`US-C4`) |
| `DELETE` | `/customers/:id` | `deleteCustomer` | Delete a customer record (Owner/Admin guard) (`US-C5`) |
| `GET` | `/customers/plate/:plateNumber` | `findCustomerByPlate` | **Murillo Week 5 Solo Checkpoint:** Find customer by motorcycle plate (`US-C6`) |

### 2. Repair Job Orders (`repairs`) — Owner: Cabatingan

| Method | Path | Handler | Story it serves |
| :--- | :--- | :--- | :--- |
| `GET` | `/repairs` | `listRepairs` | View all motorcycle repair job orders (`US-R1`) |
| `GET` | `/repairs/:id` | `showRepair` | View one repair job order by ID (`US-R2`) |
| `POST` | `/repairs` | `createRepair` | Create a new repair job order (`US-R3`) |
| `PUT` | `/repairs/:id` | `updateRepair` | Edit an existing repair job order (`US-R4`) |
| `DELETE` | `/repairs/:id` | `deleteRepair` | Delete a repair job order (Owner/Admin guard) (`US-R5`) |
| `PATCH` | `/repairs/:id/status` | `updateRepairStatus` | **Cabatingan Week 5 Solo Checkpoint:** Update repair job status (`US-R6`) |

### 3. Spare Parts Inventory (`parts`) — Owner: Dagala

| Method | Path | Handler | Story it serves |
| :--- | :--- | :--- | :--- |
| `GET` | `/parts` | `listParts` | View all spare parts in shop inventory (`US-P1`) |
| `GET` | `/parts/:id` | `showPart` | View one spare part by ID (`US-P2`) |
| `POST` | `/parts` | `createPart` | Add a new spare part to inventory (`US-P3`) |
| `PUT` | `/parts/:id` | `updatePart` | Edit a spare part's details or stock count (`US-P4`) |
| `DELETE` | `/parts/:id` | `deletePart` | Delete a discontinued spare part (Owner/Admin guard) (`US-P5`) |
| `POST` | `/parts/:id/restock` | `restockPart` | **Dagala Week 5 Solo Checkpoint:** Restock quantity for a spare part (`US-P6`) |

---

## Task 3 — Example Request + Response per Route

### Module 1: Customers (`customers`) — Tested by Alvin Murillo

#### 1. `GET /customers` (`listCustomers`)
- **Request:**
  ```http
  GET /customers HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": [
      {
        "id": 1,
        "name": "Juan Dela Cruz",
        "phone": "09171234567",
        "plateNumber": "ABC-1234",
        "motorcycleModel": "Honda Click 125i"
      }
    ]
  }
  ```

#### 2. `GET /customers/:id` (`showCustomer`)
- **Request:**
  ```http
  GET /customers/1 HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Juan Dela Cruz",
      "phone": "09171234567",
      "plateNumber": "ABC-1234",
      "motorcycleModel": "Honda Click 125i"
    }
  }
  ```

#### 3. `POST /customers` (`createCustomer`)
- **Request:**
  ```bash
  curl -X POST http://localhost:3000/customers \
    -H "Content-Type: application/json" \
    -d '{"name":"Carlo Mendoza","phone":"09192223344","plateNumber":"MTR-5588","motorcycleModel":"Yamaha Mio Aerox 155"}'
  ```
- **Response (`201 Created`):**
  ```json
  {
    "status": 201,
    "data": {
      "id": 3,
      "name": "Carlo Mendoza",
      "phone": "09192223344",
      "plateNumber": "MTR-5588",
      "motorcycleModel": "Yamaha Mio Aerox 155"
    }
  }
  ```

#### 4. `PUT /customers/:id` (`updateCustomer`)
- **Request:**
  ```bash
  curl -X PUT http://localhost:3000/customers/1 \
    -H "Content-Type: application/json" \
    -d '{"name":"Juan Dela Cruz Jr.","phone":"09179998888","plateNumber":"ABC-1234","motorcycleModel":"Honda ADV 160"}'
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Juan Dela Cruz Jr.",
      "phone": "09179998888",
      "plateNumber": "ABC-1234",
      "motorcycleModel": "Honda ADV 160"
    }
  }
  ```

#### 5. `DELETE /customers/:id` (`deleteCustomer`)
- **Request:**
  ```bash
  curl -X DELETE http://localhost:3000/customers/3 \
    -H "x-user-role: owner"
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "deleted": true,
      "id": 3
    }
  }
  ```

#### 6. `GET /customers/plate/:plateNumber` (`findCustomerByPlate` — Murillo Checkpoint)
- **Request:**
  ```http
  GET /customers/plate/ABC-1234 HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Juan Dela Cruz",
      "phone": "09171234567",
      "plateNumber": "ABC-1234",
      "motorcycleModel": "Honda Click 125i"
    }
  }
  ```

---

### Module 2: Repair Job Orders (`repairs`) — Tested by Cabatingan

#### 7. `GET /repairs` (`listRepairs`)
- **Request:**
  ```http
  GET /repairs HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": [
      {
        "id": 1,
        "customerId": 1,
        "issue": "Full CVT cleaning and engine oil change",
        "mechanic": "Berto",
        "laborCost": 850,
        "status": "in_progress"
      }
    ]
  }
  ```

#### 8. `GET /repairs/:id` (`showRepair`)
- **Request:**
  ```http
  GET /repairs/1 HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "customerId": 1,
      "issue": "Full CVT cleaning and engine oil change",
      "mechanic": "Berto",
      "laborCost": 850,
      "status": "in_progress"
    }
  }
  ```

#### 9. `POST /repairs` (`createRepair`)
- **Request:**
  ```bash
  curl -X POST http://localhost:3000/repairs \
    -H "Content-Type: application/json" \
    -d '{"customerId":1,"issue":"Front brake caliper bleed and pad replacement","mechanic":"Dante","laborCost":450,"status":"pending"}'
  ```
- **Response (`201 Created`):**
  ```json
  {
    "status": 201,
    "data": {
      "id": 3,
      "customerId": 1,
      "issue": "Front brake caliper bleed and pad replacement",
      "mechanic": "Dante",
      "laborCost": 450,
      "status": "pending"
    }
  }
  ```

#### 10. `PUT /repairs/:id` (`updateRepair`)
- **Request:**
  ```bash
  curl -X PUT http://localhost:3000/repairs/1 \
    -H "Content-Type: application/json" \
    -d '{"customerId":1,"issue":"Full CVT cleaning, belt replacement, and oil change","mechanic":"Berto","laborCost":1200,"status":"completed"}'
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "customerId": 1,
      "issue": "Full CVT cleaning, belt replacement, and oil change",
      "mechanic": "Berto",
      "laborCost": 1200,
      "status": "completed"
    }
  }
  ```

#### 11. `DELETE /repairs/:id` (`deleteRepair`)
- **Request:**
  ```bash
  curl -X DELETE http://localhost:3000/repairs/3 \
    -H "x-user-role: owner"
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "deleted": true,
      "id": 3
    }
  }
  ```

#### 12. `PATCH /repairs/:id/status` (`updateRepairStatus` — Cabatingan Checkpoint)
- **Request:**
  ```bash
  curl -X PATCH http://localhost:3000/repairs/1/status \
    -H "Content-Type: application/json" \
    -d '{"status":"paid"}'
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "customerId": 1,
      "issue": "Full CVT cleaning, belt replacement, and oil change",
      "mechanic": "Berto",
      "laborCost": 1200,
      "status": "paid"
    }
  }
  ```

---

### Module 3: Spare Parts Inventory (`parts`) — Tested by Dagala

#### 13. `GET /parts` (`listParts`)
- **Request:**
  ```http
  GET /parts HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": [
      {
        "id": 1,
        "name": "Synthetic Scooter Oil 10W-40",
        "sku": "OIL-10W40",
        "qty": 25,
        "unitPrice": 320,
        "category": "lubricants"
      }
    ]
  }
  ```

#### 14. `GET /parts/:id` (`showPart`)
- **Request:**
  ```http
  GET /parts/1 HTTP/1.1
  Host: localhost:3000
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Synthetic Scooter Oil 10W-40",
      "sku": "OIL-10W40",
      "qty": 25,
      "unitPrice": 320,
      "category": "lubricants"
    }
  }
  ```

#### 15. `POST /parts` (`createPart`)
- **Request:**
  ```bash
  curl -X POST http://localhost:3000/parts \
    -H "Content-Type: application/json" \
    -d '{"name":"NGK Iridium Spark Plug","sku":"SPK-NGK01","qty":40,"unitPrice":480,"category":"electrical"}'
  ```
- **Response (`201 Created`):**
  ```json
  {
    "status": 201,
    "data": {
      "id": 3,
      "name": "NGK Iridium Spark Plug",
      "sku": "SPK-NGK01",
      "qty": 40,
      "unitPrice": 480,
      "category": "electrical"
    }
  }
  ```

#### 16. `PUT /parts/:id` (`updatePart`)
- **Request:**
  ```bash
  curl -X PUT http://localhost:3000/parts/1 \
    -H "Content-Type: application/json" \
    -d '{"name":"Synthetic Scooter Oil 10W-40 1L","sku":"OIL-10W40","qty":20,"unitPrice":340,"category":"lubricants"}'
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Synthetic Scooter Oil 10W-40 1L",
      "sku": "OIL-10W40",
      "qty": 20,
      "unitPrice": 340,
      "category": "lubricants"
    }
  }
  ```

#### 17. `DELETE /parts/:id` (`deletePart`)
- **Request:**
  ```bash
  curl -X DELETE http://localhost:3000/parts/3 \
    -H "x-user-role: owner"
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "deleted": true,
      "id": 3
    }
  }
  ```

#### 18. `POST /parts/:id/restock` (`restockPart` — Dagala Checkpoint)
- **Request:**
  ```bash
  curl -X POST http://localhost:3000/parts/1/restock \
    -H "Content-Type: application/json" \
    -d '{"addQty":15}'
  ```
- **Response (`200 OK`):**
  ```json
  {
    "status": 200,
    "data": {
      "id": 1,
      "name": "Synthetic Scooter Oil 10W-40 1L",
      "sku": "OIL-10W40",
      "qty": 35,
      "unitPrice": 340,
      "category": "lubricants"
    }
  }
  ```

---

### Wrong Method / Missing ID Verification

- **Request (`DELETE /repairs` with no `:id`):**
  ```bash
  curl -X DELETE http://localhost:3000/repairs
  ```
- **Response (`405 Method Not Allowed`):**
  ```json
  {
    "status": 405,
    "error": "Method DELETE not allowed on /repairs"
  }
  ```
