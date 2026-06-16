/* Comfort Money – poptávkový formulář (fetch na /api/lead, validace, stavy).
   Bez <form> submitu řešíme přes preventDefault + fetch; funguje i bez JS (action/method). */
(function () {
  'use strict';

  var form = document.getElementById('leadForm');
  if (!form) return;

  var T = {
    name: 'Vyplňte prosím jméno.',
    contact: 'Zadejte prosím telefon nebo e-mail, ať se vám máme jak ozvat.',
    email: 'Zkontrolujte prosím formát e-mailu.',
    phone: 'Zkontrolujte prosím formát telefonu.',
    gdpr: 'Potvrďte prosím souhlas se zpracováním osobních údajů.',
    sending: 'Odesílám…',
    success: 'Děkujeme! Ozveme se vám co nejdříve v provozní době (Po–Pá 9–17).',
    error: 'Omlouváme se, něco se nepovedlo. Zkuste to prosím znovu, nebo zavolejte na 800 314 314.'
  };

  var phoneRe = /^(\+?420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
  var emailRe = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

  function setError(id, msg) {
    var el = document.getElementById(id);
    var field = document.getElementById('lead-' + id.replace('err-', ''));
    if (el) el.textContent = msg;
    if (field) { field.setAttribute('aria-invalid', 'true'); }
  }
  function clearErrors() {
    form.querySelectorAll('.cm-form-error').forEach(function (e) { e.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
  }
  function getUtm() {
    var utm = {};
    new URLSearchParams(location.search).forEach(function (v, k) {
      if (k.indexOf('utm_') === 0) utm[k] = v.slice(0, 200);
    });
    return utm;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    var name = document.getElementById('lead-name');
    var phone = document.getElementById('lead-phone');
    var email = document.getElementById('lead-email');
    var message = document.getElementById('lead-message');
    var gdpr = document.getElementById('lead-gdpr');
    var hp = document.getElementById('lead-website');
    var status = document.getElementById('leadStatus');
    var submit = form.querySelector('.cm-form-submit');

    var valid = true;
    if (!name.value.trim()) { setError('err-name', T.name); valid = false; }
    var hasPhone = phone.value.trim() !== '';
    var hasEmail = email.value.trim() !== '';
    if (!hasPhone && !hasEmail) { setError('err-phone', T.contact); valid = false; }
    if (hasEmail && !emailRe.test(email.value.trim())) { setError('err-email', T.email); valid = false; }
    if (hasPhone && !phoneRe.test(phone.value.trim())) { setError('err-phone', T.phone); valid = false; }
    if (!gdpr.checked) { setError('err-gdpr', T.gdpr); valid = false; }
    if (!valid) {
      var firstErr = form.querySelector('[aria-invalid]');
      if (firstErr) firstErr.focus();
      return;
    }

    var ctxEl = document.getElementById('leadCalcContext');
    var calc = null;
    try { calc = JSON.parse((ctxEl && ctxEl.value) || 'null'); } catch (err) { /* noop */ }

    var payload = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
      product: (form.querySelector('[name="product"]') || {}).value || 'obecne',
      website: hp ? hp.value : '',
      calculator: calc,
      url: location.href,
      utm: getUtm()
    };

    submit.disabled = true;
    var orig = submit.textContent;
    submit.textContent = T.sending;
    status.className = 'cm-form-status';
    status.textContent = '';

    fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return { ok: res.ok }; });
    }).then(function (data) {
      if (data && data.ok) {
        status.className = 'cm-form-status cm-form-status--ok';
        status.textContent = T.success;
        form.reset();
      } else { throw new Error('server'); }
    }).catch(function () {
      status.className = 'cm-form-status cm-form-status--err';
      status.textContent = T.error;
    }).finally(function () {
      submit.disabled = false;
      submit.textContent = orig || T.sending;
      status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });
})();
