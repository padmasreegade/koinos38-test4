const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let statsCache = null;
let cacheTimestamp = null;

// Calculate Stats
function calculateStats(items){
    return {
        total: items.length,
        averagePrice: items.length > 0 ? items.reduce((acc, cur) => acc + cur.price, 0) / items.length : 0,
        lastUpdated: new Date().toISOString()
    };
}

// Refresh stats cache after specified time
async function refreshStatsCache() {
    try {
        const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
        const items = JSON.parse(raw);
        statsCache = calculateStats(items);
        cacheTimestamp = Date.now();
        console.log('Stats cache refreshed at', cacheTimestamp);
    } catch (error) {
        console.error('Error refreshing stats cache:', error);
        throw error;
    }
}

//Initialize cache on load
refreshStatsCache().catch(console.error);

fs.watchFile(DATA_PATH, () => {
    console.log('Items file has changes, refreshing stats cache...');
    refreshStatsCache().catch(console.error);
});

// GET /api/stats
// Change - added caching strategy
router.get('/', async (req, res, next) => {
    try {
        // If cache is empty or old, fallback and refresh it. Here the time is set to 1 minute.
        if (!statsCache || (Date.now() - cacheTimestamp) > 60000) {
            await refreshStatsCache();
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;