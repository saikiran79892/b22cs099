const express = require('express');
const { createShortUrl, redirectShortUrl, getStats } = require('../controllers/shorturls');
const router = express.Router();

// Handle preflight requests
router.options('/shorturls', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.status(204).send();
});

// Main routes
router.post('/shorturls', async (req, res, next) => {
  try {
    // Log the incoming request
    console.log('Received POST request to /shorturls:', {
      body: req.body,
      headers: req.headers
    });
    await createShortUrl(req, res, next);
  } catch (error) {
    console.error('Error in POST /shorturls:', error);
    next(error);
  }
});

router.get('/shorturls/:shortcode', getStats); // stats
router.get('/:shortcode', redirectShortUrl);     // redirect

module.exports = router;
