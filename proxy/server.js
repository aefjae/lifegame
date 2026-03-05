require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'null'] }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in proxy/.env' });
  }

  try {
    const response = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach Anthropic API', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`LIFEGAME proxy running on http://localhost:${PORT}`);
  console.log(`API key: ${process.env.ANTHROPIC_API_KEY ? '✓ set' : '✗ MISSING — add to proxy/.env'}`);
});
