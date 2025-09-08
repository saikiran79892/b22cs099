const axios = require('axios');
require('dotenv').config();

// Your provided token
const STATIC_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzYWlraXJhbmRhc2FyaTE3QGdtYWlsLmNvbSIsImV4cCI6MTc1NzMxMDQzNSwiaWF0IjoxNzU3MzA5NTM1LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGNhZWNiMzQtNGQzNC00ZDZhLTgyZDEtNmYwMDI2ODgzMjAzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoic2FpIGtpcmFuIGRhc2FyaSIsInN1YiI6IjJjM2IxMzk3LTY0N2QtNDZhYS1hMGVlLTA0YTBlMTkxNDIxYiJ9LCJlbWFpbCI6InNhaWtpcmFuZGFzYXJpMTdAZ21haWwuY29tIiwibmFtZSI6InNhaSBraXJhbiBkYXNhcmkiLCJyb2xsTm8iOiJiMjJjczA5OSIsImFjY2Vzc0NvZGUiOiJxcVF6WmsiLCJjbGllbnRJRCI6IjJjM2IxMzk3LTY0N2QtNDZhYS1hMGVlLTA0YTBlMTkxNDIxYiIsImNsaWVudFNlY3JldCI6ImJQQnd5ZEdxUmpic1dudk0ifQ.wrynfzk7yx4N8JQBBF-uITNRwweoU1t31ZYSfKXZnLw';

// Constants for the evaluation service
const BASE_URL = 'http://20.244.56.144/evaluation-service';
const LOG_ENDPOINT = `${BASE_URL}/log`;

async function fetchToken() {
  // Return the static token since we already have it
  return STATIC_TOKEN;
}

async function getToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  return await fetchToken();
}

async function Log(stack, level, pkg, message, extra = {}) {
  try {
    const token = await fetchToken();
    const payload = {
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      timestamp: new Date().toISOString(),
      eventType: level,
      message: `[${stack}] ${pkg}: ${message}`,
      metadata: extra
    };

    const response = await axios({
      method: 'post',
      url: LOG_ENDPOINT,
      data: payload,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      validateStatus: (status) => status >= 200 && status < 500
    });

    if (response.status >= 400) {
      console.warn('Log API returned error:', response.status, response.data);
    }
  } catch (err) {
    // Silent fail - just log to console for debugging
    console.warn('Logging failed:', err.message);
    if (err.response) {
      console.warn('Response data:', err.response.data);
    }
  }
}

module.exports = { Log };
