const Url = require('../models/Url');
const generateShortcode = require('../utils/generateShortcode');

async function createShortUrl(req, res, next) {
  try {
    console.log('Creating short URL with body:', req.body);
    
    const { url, validity, shortcode } = req.body;
    if (!url) {
      console.log('URL missing in request');
      return res.status(400).json({ error: 'url is required' });
    }

    const validityMinutes = Number(validity) || Number(process.env.DEFAULT_VALIDITY_MIN) || 30;
    const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);

    let finalCode = shortcode;
    if (finalCode) {
      const exists = await Url.findOne({ shortcode: finalCode });
      if (exists) return res.status(409).json({ error: 'shortcode already exists' });
    } else {
      // generate unique code
      for (let i = 0; i < 6; i++) {
        finalCode = generateShortcode();
        const exists = await Url.findOne({ shortcode: finalCode });
        if (!exists) break;
      }
      // if still exists after attempts, append timestamp
      if (await Url.findOne({ shortcode: finalCode })) {
        finalCode = finalCode + Date.now().toString(36).slice(-4);
      }
    }

    const doc = await Url.create({
      originalUrl: url,
      shortcode: finalCode,
      expiry
    });

    const shortLink = `${req.protocol}://${req.get('host')}/${doc.shortcode}`;
    return res.status(201).json({ shortLink, expiry: doc.expiry });
  } catch (err) {
    next(err);
  }
}

async function redirectShortUrl(req, res, next) {
  try {
    const { shortcode } = req.params;
    const doc = await Url.findOne({ shortcode });
    if (!doc) return res.status(404).json({ error: 'shortcode not found' });
    if (new Date() > doc.expiry) return res.status(410).json({ error: 'link expired' });

    // record click (non-blocking)
    doc.clicks.push({
      referrer: req.get('referer') || req.get('referrer') || '',
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    await doc.save();

    return res.redirect(doc.originalUrl);
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const { shortcode } = req.params;
    const doc = await Url.findOne({ shortcode }).lean();
    if (!doc) return res.status(404).json({ error: 'shortcode not found' });

    const totalClicks = (doc.clicks || []).length;
    return res.json({
      totalClicks,
      originalUrl: doc.originalUrl,
      createdAt: doc.createdAt,
      expiry: doc.expiry,
      clicks: doc.clicks
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { createShortUrl, redirectShortUrl, getStats };
