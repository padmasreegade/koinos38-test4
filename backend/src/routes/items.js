const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
    try {
        const data = await readData();
        const {limit = 10, page = 1, q} = req.query;
        let results = data;

        if (q) {
            // Enhanced search with filters - name, category, price
            const searchTerm = q.toLowerCase();
            results = results.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.price.toString().includes(searchTerm)
            );
        }

        //pagination logic
        const totalItems = results.length;
        const itemsPerPage = parseInt(limit);
        const currentPage = parseInt(page);
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        const paginatedResults = results.slice(startIndex, endIndex);
        res.json({

            items: paginatedResults,
            pagination: {
                currentPage,
                totalPages,
                totalItems,
                itemsPerPage,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1
            },
            searchQuery: q || null
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
    try {
        const data = await readData();
        const item = data.find(i => i.id === parseInt(req.params.id));
        if (!item) {
            const err = new Error('Item not found');
            err.status = 404;
            throw err;
        }
        res.json(item);
    } catch (err) {
        next(err);
    }
});

// POST /api/items
router.post('/', async (req, res, next) => {
    try {
        // TODO: Validate payload (intentional omission)
        if (!req.body) {
            const error = new Error('Request body is missing.');
            error.status = 400;
            return next(error);
        }
        if (Object.keys(req.body).length === 0) {
            const error = new Error('Request body cannot be an empty JSON object.');
            error.status = 400;
            return next(error);
        }
        if (!req.body.name || !req.body.price) {
            const error = new Error('Request body must contain required fields: name and price.');
            error.status = 400;
            return next(error);
        }
        const item = req.body;
        const data = await readData();
        item.id = Date.now();
        data.push(item);
        await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
        res.status(201).json(item);
    } catch (err) {
        next(err);
    }
});

module.exports = router;