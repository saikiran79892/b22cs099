# URL Shortener Backend

A URL shortener service with logging middleware that reports to an evaluation server.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy .env.template to .env and update values if needed (credentials are already set)

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Create Short URL
- POST /shorturls
- Body: { "url": "https://example.com", "validity": 30 }
- Returns: { "shortLink": "http://localhost:3000/abc123", "expiry": "..." }

### Redirect to Original URL
- GET /:shortcode
- Redirects to the original URL if valid

### Get URL Stats
- GET /shorturls/:shortcode
- Returns click statistics and URL details

## Notes

- MongoDB must be running locally on default port (27017)
- The server logs all requests and errors to the evaluation server
- Default URL validity is 30 minutes if not specified
