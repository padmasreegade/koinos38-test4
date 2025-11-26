const request = require('supertest');
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const itemsRouter = require('./items');

// Test app
const app = express();
app.use(express.json());
app.use('/api/items', itemsRouter);

// error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error', error: err.stack
    });
});

const TEST_DATA_PATH = path.join(__dirname, '../../../data/items.json');

// mock data
const mockItems = [{id: 1, name: 'Laptop', category: 'Electronics', price: 999}, {
    id: 2, name: 'Chair', category: 'Furniture', price: 299
}, {id: 3, name: 'Phone', category: 'Electronics', price: 599}];

// Store the original data before manipulating it for tests.
let originalData;

beforeAll(async () => {
    try {
        originalData = await fs.readFile(TEST_DATA_PATH, 'utf-8');
    } catch (err) {
        originalData = null;
    }
});

// Restore original data after tests.
afterAll(async () => {
    if (originalData !== null) {
        await fs.writeFile(TEST_DATA_PATH, originalData, 'utf-8');
    }
});

// Set up test data before each test.
beforeEach(async () => {
    await fs.writeFile(TEST_DATA_PATH, JSON.stringify(mockItems, null, 2), 'utf-8');
});

describe('Items Routes', () => {
    describe('GET /api/items', () => {
        // Happy path test for get items.
        it('should return paginated results with metadata with no query parameters', async () => {
            const response = await request(app)
                .get('/api/items')
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(response.body).toHaveProperty('pagination');
            expect(response.body).toHaveProperty('searchQuery');

            expect(response.body.items).toHaveLength(3);
            expect(response.body.items[0]).toHaveProperty('id', 1);
            expect(response.body.items[0]).toHaveProperty('name', 'Laptop');
            expect(response.body.items[0]).toHaveProperty('category', 'Electronics');
            expect(response.body.items[0]).toHaveProperty('price', 999);

            expect(response.body.pagination).toHaveProperty('currentPage', 1);
            expect(response.body.pagination).toHaveProperty('totalItems', 3);
            expect(response.body.pagination).toHaveProperty('itemsPerPage', 10);
            expect(response.body.searchQuery).toBeNull();
        });

        it('should filter items by search query', async () => {
            const response = await request(app)
                .get('/api/items?q=laptop')
                .expect(200);

            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].name).toBe('Laptop');
            expect(response.body.searchQuery).toBe('laptop');
            expect(response.body.pagination.totalItems).toBe(1);
        });

        it('should filter items by case insensitive search query', async () => {
            const response = await request(app)
                .get('/api/items?q=LAPTOP')
                .expect(200);

            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].name).toBe('Laptop');
        });

        it('should limit result when limit is provided', async () => {
            const response = await request(app)
                .get('/api/items?q=chair&limit=1')
                .expect(200);

            expect(response.body.items).toHaveLength(1);
            expect(response.body.items[0].name).toBe('Chair');
        });

        it('should return empty result on search query mismatch', async () => {
            const response = await request(app)
                .get('/api/items?q=abc&limit=1')
                .expect(200);

            expect(response.body.items).toHaveLength(0);
            expect(response.body.pagination.totalItems).toBe(0);
        });

        it('should handle pagination properly', async () => {
            const response = await request(app)
                .get('/api/items?page=2&limit=2')
                .expect(200);

            expect(response.body.items).toHaveLength(1); //3rd item from the data
            expect(response.body.pagination.currentPage).toBe(2);
            expect(response.body.pagination.totalPages).toBe(2);
            expect(response.body.pagination.hasNextPage).toBe(false);
            expect(response.body.pagination.hasPrevPage).toBe(true);
        });

        it('should search accross name, category and price fields', async () => {
            const response = await request(app)
                .get('/api/items?q=electronics')
                .expect(200);

            expect(response.body.items).toHaveLength(2); //3rd item from the data
            expect(response.body.items.every(item => item.category === 'Electronics')).toBe(true);
        });

        //Error case.
        it('should handle file read errors gracefully', async () => {
            // Temporarily make the file unreadable.
            await fs.unlink(TEST_DATA_PATH).catch(() => {
            });
            const response = await request(app)
                .get('/api/items')
                .expect(500);
        });

    });

    describe('GET /api/items:id', () => {

        //Happy path test for get item with id.
        it('should search accross name, category and price fields', async () => {
            const response = await request(app)
                .get('/api/items/1')
                .expect(200);

            expect(response.body).toHaveProperty('id', 1);
            expect(response.body).toHaveProperty('name', 'Laptop');
            expect(response.body).toHaveProperty('category', 'Electronics');
            expect(response.body).toHaveProperty('price', 999);
        });

        // Error cases.
        it('should return 404 for a mismatch', async () => {
            const response = await request(app)
                .get('/api/items/10')
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });

        it('should handle invalid id', async () => {
            const response = await request(app)
                .get('/api/items/abd')
                .expect(404);

            expect(response.body).toHaveProperty('message');
        });

        it('should handle file read errors gracefully', async () => {
            // Temporarily make the file unreadable.
            await fs.unlink(TEST_DATA_PATH).catch(() => {
            });
            const response = await request(app)
                .get('/api/items/1')
                .expect(500);
        });
    });

    describe('POST /api/items', () => {
        // Happy path tests.
        it('should create new item successfully', async () => {
            const newItem = {
                name: 'Tablet', category: 'Electronics', price: 399
            };

            const response = await request(app)
                .post('/api/items')
                .send(newItem)
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toBe(newItem.name);
            expect(response.body.category).toBe(newItem.category);
            expect(response.body.price).toBe(newItem.price);
            expect(typeof response.body.id).toBe('number');
        });
        it('should generate unique id', async () => {
            const newItem1 = {
                name: 'Tablet', category: 'Electronics', price: 399
            };
            const newItem2 = {
                name: 'Earphones', category: 'Electronics', price: 199
            };

            const response1 = await request(app)
                .post('/api/items')
                .send(newItem1)
                .expect(201);

            await new Promise(resolve => setTimeout(resolve, 10));

            const response2 = await request(app)
                .post('/api/items')
                .send(newItem2)
                .expect(201);

            expect(response1.body.id).not.toBe(response2.body.id);
        });
        it('should handle empty request body', async () => {
            const response = await request(app)
                .post('/api/items')
                .send({})
                .expect(400);
        });
        it('should handle invalid json request body', async () => {
            const response = await request(app)
                .post('/api/items')
                .set('Content-type', 'application/json')
                .send('invalid json')
                .expect(400);
        });
    });

    describe('Integration test', () => {
        it('should maintain data consistency across operations', async () => {
            // Get initial item count.
            const initialResponse = await request(app)
                .get('/api/items')
                .expect(200);
            const initialCount = initialResponse.body.items.length;
            // Create a new item.
            const newItem = {name: 'Tony Stark', category: 'superhero', price: 3000};
            const createResponse = await request(app)
                .post('/api/items')
                .send(newItem)
                .expect(201);
            const createdId = createResponse.body.id;

            // Verify updated item count.
            const postCreateResponse = await request(app)
                .get('/api/items')
                .expect(200);
            expect(postCreateResponse.body.items.length).toBe(initialCount + 1);

            // Verify the new item is retrievable.
            const getItemResponse = await request(app)
                .get(`/api/items/${createdId}`)
                .expect(200);

            expect(getItemResponse.body.name).toBe(newItem.name);
            expect(getItemResponse.body.category).toBe(newItem.category);
            expect(getItemResponse.body.price).toBe(newItem.price);
        });
    });
});