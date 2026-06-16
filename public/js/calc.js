/* Comfort Money – kalkulačky (čistý JS). Textová pole pro částky.
   MODELOVÁ SAZBA 18 % p.a. – k potvrzení compliance.
   Prefixy ID: 'calc' = sloučení dluhů, 'loan' = spotřebitelský, 'biz' = podnikatelský. */
(function () {
  'use strict';
  var RATE = 0.18;

  function $(id) { return document.getElementById(id); }
  function digits(v) { return parseInt(String(v).replace(/[^\d]/g, ''), 10) || 0; }
  function czk(n) { return Math.round(n).toLocaleString('cs-CZ') + ' Kč'; }
  function fmt(n) { return n.toLocaleString('cs-CZ'); }
  function annuity(p, years) { var r = RATE / 12, n = years * 12; return r === 0 ? p / n : p * r / (1 - Math.pow(1 + r, -n)); }
  function onAmount(el, recalc) {
    el.addEventListener('input', recalc);
    el.addEventListener('blur', function () { var n = digits(el.value); el.value = n ? fmt(n) : ''; });
  }

  /* Sloučení dluhů: dluhy + splátky + splatnost → nová splátka + úspora */
  function initConsolidation(p) {
    var debts = $(p + 'Debts'), pay = $(p + 'Payment'), term = $(p + 'Term'), newEl = $(p + 'New'), saveEl = $(p + 'Saving');
    if (!debts || !newEl) return;
    function upd() {
      var d = digits(debts.value), c = digits(pay.value), y = +term.value;
      var np = annuity(d, y), s = c - np;
      newEl.textContent = czk(np);
      if (s > 0) { saveEl.className = 'cm-calc__saving cm-calc__saving--positive'; saveEl.textContent = 'Měsíčně ušetříte přibližně ' + czk(s); }
      else { saveEl.className = 'cm-calc__saving'; saveEl.textContent = 'Připravíme vám individuální návrh na míru.'; }
    }
    onAmount(debts, upd); onAmount(pay, upd); term.addEventListener('change', upd);
    upd();
  }

  /* Úvěr: výše + splatnost → měsíční splátka + celkem */
  function initLoan(p) {
    var amt = $(p + 'Amount'), term = $(p + 'Term'), payEl = $(p + 'Payment');
    if (!amt || !payEl) return;
    function upd() {
      var a = digits(amt.value), y = +term.value, pmt = annuity(a, y);
      payEl.textContent = czk(pmt);
    }
    onAmount(amt, upd); term.addEventListener('change', upd);
    upd();
  }

  initConsolidation('calc');
  initLoan('loan');
  initLoan('biz');
})();
