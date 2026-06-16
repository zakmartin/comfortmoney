/* Lead pipeline: validace + doručovací adaptér (webhook / smtp dle env LEAD_DELIVERY).
   Pole formuláře Comfort Money: jméno, telefon, e-mail, situace (zpráva), produkt.
   Kalkulačka úspory posílá whitelistovaná čísla (dluhy, stará splátka, splatnost…). */
'use strict';

const MAX = { name: 200, phone: 40, email: 254, message: 4000, product: 60, url: 500 };
const PHONE_RE = /^(\+?420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const MSG_MIN = 8;
const PRODUCTS = ['konsolidace', 'zajisteny-uver', 'podnikatelsky-uver', 'obecne'];

function clip(v, max) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}

/** Validace + očištění vstupu. Vrací { ok, errors, lead }. */
function validate(body) {
  const errors = {};
  const product = clip(body.product, MAX.product);
  const lead = {
    name: clip(body.name, MAX.name),
    phone: clip(body.phone, MAX.phone),
    email: clip(body.email, MAX.email),
    message: clip(body.message, MAX.message),
    product: PRODUCTS.includes(product) ? product : 'obecne',
    lang: 'cs',
    url: clip(body.url, MAX.url),
    utm: null,
    calculator: null,
    ts: new Date().toISOString(),
  };

  if (!lead.name) errors.name = 'required';
  // telefon NEBO e-mail musí být vyplněn (klient ve stresu často radši zavolá)
  if (!lead.phone && !lead.email) errors.contact = 'required';
  if (lead.email && !EMAIL_RE.test(lead.email)) errors.email = 'invalid';
  if (lead.phone && !PHONE_RE.test(lead.phone)) errors.phone = 'invalid';
  if (lead.message && lead.message.length < MSG_MIN) errors.message = 'too_short';
  // HTML ve volných polích neakceptujeme
  if (/[<>]/.test(lead.message) || /[<>]/.test(lead.name)) {
    errors.message = errors.message || 'invalid';
  }

  // kalkulačka úspory – jen whitelistovaná čísla
  let calc = body.calculator;
  if (typeof calc === 'string' && calc) {
    try { calc = JSON.parse(calc); } catch { calc = null; }
  }
  if (calc && typeof calc === 'object') {
    const num = (x) => (Number.isFinite(+x) ? +x : null);
    lead.calculator = {
      debts: num(calc.debts),             // celková výše dluhů
      currentPayment: num(calc.currentPayment), // současné měsíční splátky
      termYears: num(calc.termYears),     // zvolená splatnost (roky)
      newPayment: num(calc.newPayment),   // orientační nová splátka
      monthlySaving: num(calc.monthlySaving), // orientační měsíční úspora
    };
  }

  if (body.utm && typeof body.utm === 'object') {
    lead.utm = {};
    for (const [k, v] of Object.entries(body.utm)) {
      if (k.startsWith('utm_')) lead.utm[clip(k, 50)] = clip(String(v), 200);
    }
  }

  return { ok: Object.keys(errors).length === 0, errors, lead };
}

/* ---------- doručovací adaptéry ---------- */

async function deliverWebhook(lead) {
  const url = process.env.FORM_API_URL;
  if (!url) throw new Error('FORM_API_URL is not set (LEAD_DELIVERY=webhook)');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: 'comfortmoney.cz', type: 'lead', lead }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

async function deliverSmtp(lead) {
  // SMTP adaptér – aktivace: LEAD_DELIVERY=smtp + SMTP_* env
  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch {
    throw new Error('nodemailer is not installed – run `npm i nodemailer` for LEAD_DELIVERY=smtp');
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +(process.env.SMTP_PORT || 587),
    secure: +(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const c = lead.calculator;
  const czk = (n) => Math.round(n).toLocaleString('cs-CZ') + ' Kč';
  const calcLine = c && c.debts
    ? `\nKalkulačka: dluhy ${czk(c.debts)}, současná splátka ${c.currentPayment ? czk(c.currentPayment) : '–'}, splatnost ${c.termYears || '–'} let → orientační nová splátka ${c.newPayment ? czk(c.newPayment) : '–'}` +
      (c.monthlySaving ? ` (úspora ≈ ${czk(c.monthlySaving)}/měs.)` : '')
    : '';
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.LEAD_EMAIL_TO,
    subject: `Nová poptávka z comfortmoney.cz – ${lead.name} (${lead.product})`,
    text: `Jméno: ${lead.name}\nTelefon: ${lead.phone || '–'}\nE-mail: ${lead.email || '–'}\nProdukt: ${lead.product}\nSituace: ${lead.message || '–'}${calcLine}\n\nURL: ${lead.url}\nČas: ${lead.ts}`,
  });
}

async function deliver(lead) {
  const mode = (process.env.LEAD_DELIVERY || 'webhook').toLowerCase();
  if (mode === 'log') {
    // dev režim – jen vypíše do konzole (bez osobních údajů kromě jména/produktu)
    console.log(`[lead] (log mode) ${lead.name} · ${lead.product} · tel:${lead.phone ? 'ano' : '–'} mail:${lead.email ? 'ano' : '–'}`);
    return;
  }
  if (mode === 'smtp') return deliverSmtp(lead);
  return deliverWebhook(lead);
}

module.exports = { validate, deliver };
