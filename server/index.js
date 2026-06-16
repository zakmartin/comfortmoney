/* Comfort Money — Express server: statika + /api/lead + bezpečnostní hlavičky */
'use strict';

const path = require('path');
const express = require('express');
const { validate, deliver } = require('./lead');

const app = express();
const PORT = +(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

app.disable('x-powered-by');
app.set('trust proxy', true);

/* ---------- bezpečnostní hlavičky ----------
   CSP povoluje vlastní origin + Google Fonts (styl/font). Skripty jen z vlastního originu. */
app.use((req, res, next) => {
  res.set({
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

/* ---------- /api/lead ---------- */
app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

// jednoduchý in-memory rate limit dle IP (token bucket: max 5 / min)
const buckets = new Map();
const RL_MAX = 5;
const RL_WINDOW = 60_000;

function rateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now > b.reset) {
    b = { count: 0, reset: now + RL_WINDOW };
    buckets.set(ip, b);
  }
  b.count += 1;
  return b.count > RL_MAX;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, b] of buckets) if (now > b.reset) buckets.delete(ip);
}, RL_WINDOW).unref();

app.post('/api/lead', async (req, res) => {
  const isFormPost = (req.headers['content-type'] || '').includes('application/x-www-form-urlencoded');

  // honeypot — vyplněné pole "website" = bot; tváříme se, že je vše OK
  if (req.body && typeof req.body.website === 'string' && req.body.website.trim() !== '') {
    return isFormPost ? res.redirect(303, '/dekujeme/') : res.json({ ok: true });
  }

  if (rateLimited(req.ip)) {
    return res.status(429).json({ ok: false, errors: { rate: 'too_many_requests' } });
  }

  // no-JS fallback posílá calcContext jako pole formuláře
  if (isFormPost && req.body.calcContext) req.body.calculator = req.body.calcContext;

  const { ok, errors, lead } = validate(req.body || {});
  if (!ok) {
    return isFormPost
      ? res.redirect(303, '/kontakt/')
      : res.status(400).json({ ok: false, errors });
  }

  try {
    await deliver(lead);
  } catch (err) {
    console.error('[lead] delivery failed:', err.message); // bez osobních údajů
    return isFormPost
      ? res.redirect(303, '/kontakt/')
      : res.status(502).json({ ok: false, errors: { delivery: 'failed' } });
  }

  return isFormPost ? res.redirect(303, '/dekujeme/') : res.json({ ok: true });
});

/* ---------- health check ---------- */
app.get('/healthz', (req, res) => res.json({ ok: true }));

/* ---------- statika ---------- */
app.use(express.static(PUBLIC_DIR, {
  extensions: ['html'],
  setHeaders(res, filePath) {
    if (/\.(css|js|svg|jpg|jpeg|png|webp|avif|woff2?)$/.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=86400');
    }
  },
}));

/* ---------- 404 ---------- */
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'), (err) => {
    if (err) res.type('text').send('404 — stránka nenalezena');
  });
});

app.listen(PORT, () => {
  console.log(`Comfort Money běží na http://localhost:${PORT} (leady: ${process.env.LEAD_DELIVERY || 'webhook'})`);
});
